import { Router, type IRouter } from "express";
import { and, desc, eq, sql } from "drizzle-orm";
import {
  db,
  topicsTable,
  problemsTable,
  practiceSessionsTable,
  practiceProblemsTable,
  practiceAttemptsTable,
} from "@workspace/db";
import {
  StartPracticeSessionBody,
  StartPracticeSessionResponse,
  NextPracticeProblemBody,
  NextPracticeProblemResponse,
  GradePracticeAnswerBody,
  GradePracticeAnswerResponse,
} from "@workspace/api-zod";
import { chatJson } from "../lib/ai";
import { gradeAnswer } from "../lib/grading";

const router: IRouter = Router();

function parseIdParam(raw: unknown): number {
  const s = Array.isArray(raw) ? raw[0] : (raw as string);
  return parseInt(s ?? "", 10);
}

async function pickTopicId(
  weekNumber: number | null | undefined,
  preferred: number | null | undefined,
  focusOnWeaknesses: boolean,
): Promise<{ id: number; title: string; weekNumber: number }> {
  if (preferred != null) {
    const [t] = await db.select().from(topicsTable).where(eq(topicsTable.id, preferred));
    if (t) return { id: t.id, title: t.title, weekNumber: t.weekNumber };
  }
  const candidates = weekNumber
    ? await db.select().from(topicsTable).where(eq(topicsTable.weekNumber, weekNumber))
    : await db.select().from(topicsTable);

  if (focusOnWeaknesses) {
    const stats = await db.execute(sql`
      select topic_id, count(*)::int as n, avg(case when correct then 1.0 else 0.0 end) as acc
      from practice_attempts group by topic_id
    `);
    const byId = new Map<number, { n: number; acc: number }>();
    for (const r of stats.rows as Array<{ topic_id: number; n: number; acc: number }>) {
      byId.set(Number(r.topic_id), { n: Number(r.n), acc: Number(r.acc) });
    }
    // weight = (1 - accuracy) + small bonus for low-attempted topics
    const scored = candidates.map((t) => {
      const s = byId.get(t.id);
      const acc = s?.acc ?? 0.5;
      const n = s?.n ?? 0;
      const weight = (1 - acc) * 2 + (n < 3 ? 1 : 0) + Math.random() * 0.3;
      return { t, weight };
    });
    scored.sort((a, b) => b.weight - a.weight);
    const choice = scored[0]?.t ?? candidates[Math.floor(Math.random() * candidates.length)]!;
    return { id: choice.id, title: choice.title, weekNumber: choice.weekNumber };
  }
  const choice = candidates[Math.floor(Math.random() * candidates.length)]!;
  return { id: choice.id, title: choice.title, weekNumber: choice.weekNumber };
}

router.post("/practice/sessions", async (req, res): Promise<void> => {
  const parsed = StartPracticeSessionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { weekNumber, topicId, assignmentId, tutorEnabled, focusOnWeaknesses, initialDifficulty } =
    parsed.data;
  const startDifficulty =
    typeof initialDifficulty === "number" && !Number.isNaN(initialDifficulty)
      ? Math.max(1, Math.min(5, initialDifficulty))
      : 2.0;
  const [created] = await db
    .insert(practiceSessionsTable)
    .values({
      weekNumber: weekNumber ?? null,
      topicId: topicId ?? null,
      assignmentId: assignmentId ?? null,
      tutorEnabled,
      focusOnWeaknesses: focusOnWeaknesses ?? true,
      difficulty: startDifficulty,
    })
    .returning();
  if (!created) {
    res.status(500).json({ error: "failed" });
    return;
  }
  res.json(
    StartPracticeSessionResponse.parse({
      id: created.id,
      tutorEnabled: created.tutorEnabled,
      difficulty: created.difficulty,
      weekNumber: created.weekNumber,
      topicId: created.topicId,
      assignmentId: created.assignmentId,
      focusOnWeaknesses: created.focusOnWeaknesses,
    }),
  );
});

router.post("/practice/sessions/:sessionId/next", async (req, res): Promise<void> => {
  const sessionId = parseIdParam(req.params.sessionId);
  const parsed = NextPracticeProblemBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [session] = await db
    .select()
    .from(practiceSessionsTable)
    .where(eq(practiceSessionsTable.id, sessionId));
  if (!session) {
    res.status(404).json({ error: "session not found" });
    return;
  }

  // Assignment-scoped practice: never reuse the real graded prompts, and mirror the
  // assignment's own topic set when the caller doesn't pin a specific topic.
  let bannedPrompts: string[] = [];
  let assignmentTopicIds: number[] = [];
  if (session.assignmentId != null) {
    const aProblems = await db
      .select({ prompt: problemsTable.prompt, topicId: problemsTable.topicId })
      .from(problemsTable)
      .where(eq(problemsTable.assignmentId, session.assignmentId));
    bannedPrompts = aProblems.map((p) => p.prompt);
    assignmentTopicIds = [...new Set(aProblems.map((p) => p.topicId))];
  }

  let preferredTopic = parsed.data.topicId ?? session.topicId;
  if (preferredTopic == null && assignmentTopicIds.length > 0) {
    preferredTopic =
      assignmentTopicIds[Math.floor(Math.random() * assignmentTopicIds.length)]!;
  }

  const topic = await pickTopicId(
    session.weekNumber,
    preferredTopic,
    session.focusOnWeaknesses,
  );

  // Avoid repeats across the whole session (not just this topic) plus every real graded prompt.
  const recent = await db
    .select({ prompt: practiceProblemsTable.prompt })
    .from(practiceProblemsTable)
    .where(eq(practiceProblemsTable.sessionId, sessionId))
    .orderBy(desc(practiceProblemsTable.id))
    .limit(12);
  const avoidPrompts = [...recent.map((p) => p.prompt), ...bannedPrompts];

  const difficulty = Math.max(1, Math.min(5, session.difficulty));
  const difficultyLabel =
    difficulty <= 1.7
      ? "very easy"
      : difficulty <= 2.5
      ? "easy"
      : difficulty <= 3.3
      ? "medium"
      : difficulty <= 4.1
      ? "hard"
      : "challenging";

  // Hard guarantee that practice never reuses a real graded prompt (or a recent one):
  // the LLM hint is best-effort, so we also reject collisions and regenerate.
  const normalize = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  const bannedNorm = new Set(avoidPrompts.map(normalize));

  const userRequest = parsed.data.request?.trim() || "";
  let generated: { prompt: string; correctAnswer: string; explanation: string } | null = null;
  for (let attempt = 0; attempt < 4; attempt++) {
    let candidate: { prompt: string; correctAnswer: string; explanation: string };
    try {
      candidate = await chatJson<{
        prompt: string;
        correctAnswer: string;
        explanation: string;
      }>(
        `You generate a single conceptual-physics practice problem for a college freshman. The problem MUST be on the topic "${topic.title}" and at difficulty "${difficultyLabel}" (${difficulty.toFixed(
          1,
        )}/5). Favor conceptual understanding over heavy algebra; simple arithmetic or a single equation like F=ma is fine, but the focus is on physical reasoning. The answer must be a short string (a single word, short phrase, number, or letter choice) — never multi-paragraph. Respond as strict JSON: {"prompt": string, "correctAnswer": string, "explanation": string}. You MUST NOT reproduce, copy, or lightly reword any of these forbidden questions (they are the real graded questions and recently shown practice — generate something genuinely different that tests the same concept): ${JSON.stringify(
          avoidPrompts,
        )}.`,
        userRequest || `Generate a new ${difficultyLabel} problem on ${topic.title}.`,
      );
    } catch {
      break;
    }
    if (!bannedNorm.has(normalize(candidate.prompt))) {
      generated = candidate;
      break;
    }
  }
  if (!generated) {
    // Deterministic fallback, tagged so it can never collide with a graded prompt.
    generated = {
      prompt: `Practice (${topic.title}) [${Date.now().toString(36)}]: A 2 kg cart is pushed with a net force of 10 newtons. What is its acceleration, in m/s²?`,
      correctAnswer: "5",
      explanation:
        "By Newton's second law, F = ma, so a = F/m = 10 N ÷ 2 kg = 5 m/s². Net force causes acceleration in proportion to force and inversely to mass.",
    };
  }

  const [stored] = await db
    .insert(practiceProblemsTable)
    .values({
      sessionId,
      topicId: topic.id,
      prompt: generated.prompt,
      correctAnswer: generated.correctAnswer,
      explanation: generated.explanation,
      difficulty,
    })
    .returning();
  if (!stored) {
    res.status(500).json({ error: "failed" });
    return;
  }

  res.json(
    NextPracticeProblemResponse.parse({
      id: stored.id,
      prompt: stored.prompt,
      topicId: topic.id,
      topicTitle: topic.title,
      difficulty,
    }),
  );
});

router.post("/practice/sessions/:sessionId/grade", async (req, res): Promise<void> => {
  const sessionId = parseIdParam(req.params.sessionId);
  const parsed = GradePracticeAnswerBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { problemId, answer, trace } = parsed.data;
  const [session] = await db
    .select()
    .from(practiceSessionsTable)
    .where(eq(practiceSessionsTable.id, sessionId));
  if (!session) {
    res.status(404).json({ error: "session not found" });
    return;
  }
  const [problem] = await db
    .select()
    .from(practiceProblemsTable)
    .where(
      and(
        eq(practiceProblemsTable.id, problemId),
        eq(practiceProblemsTable.sessionId, sessionId),
      ),
    );
  if (!problem) {
    res.status(404).json({ error: "problem not found in this session" });
    return;
  }

  const graded = await gradeAnswer({
    prompt: problem.prompt,
    correctAnswer: problem.correctAnswer,
    userAnswer: answer,
  });

  await db.insert(practiceAttemptsTable).values({
    sessionId,
    problemId,
    topicId: problem.topicId,
    answer,
    correct: graded.correct,
    difficulty: problem.difficulty,
    trace,
  });

  const delta = graded.correct ? 0.4 : -0.5;
  const newDifficulty = Math.max(1, Math.min(5, session.difficulty + delta));
  await db
    .update(practiceSessionsTable)
    .set({ difficulty: newDifficulty })
    .where(eq(practiceSessionsTable.id, sessionId));

  let tutorTip: string | null = null;
  if (session.tutorEnabled) {
    const sys = graded.correct
      ? 'You are a kind, concise conceptual-physics tutor. The student just answered correctly. In 2 sentences max, reinforce WHY their reasoning works and name one related idea or common trap to stay sharp on for the graded version. Respond as strict JSON: {"tip": string}.'
      : 'You are a kind, concise conceptual-physics tutor. Given a problem, the correct answer, and the student\'s wrong attempt, give ONE focused next-step tip that names the specific concept to review (2 sentences max). Respond as strict JSON: {"tip": string}.';
    try {
      tutorTip = (
        await chatJson<{ tip: string }>(
          sys,
          JSON.stringify({
            prompt: problem.prompt,
            correctAnswer: problem.correctAnswer,
            studentAnswer: answer,
            wasCorrect: graded.correct,
          }),
        )
      ).tip;
    } catch {
      tutorTip = null;
    }
  }

  res.json(
    GradePracticeAnswerResponse.parse({
      problemId,
      correct: graded.correct,
      correctAnswer: problem.correctAnswer,
      explanation: graded.explanation || problem.explanation,
      newDifficulty,
      tutorTip,
    }),
  );
});

export default router;
