import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "wouter";
import {
  useGetAssignment,
  useGetAssignmentReadiness,
  useStartPracticeSession,
  useNextPracticeProblem,
  useGradePracticeAnswer,
  useAskTutor,
  type PracticeProblem,
  type PracticeGrade,
  type KeystrokeTrace,
} from "@workspace/api-client-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { AnswerInput } from "@/components/AnswerInput";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Sparkles,
  Send,
  Target,
  GraduationCap,
  Infinity as InfinityIcon,
} from "lucide-react";

type TutorMsg = { role: "user" | "tutor"; text: string };

const EMPTY_TRACE: KeystrokeTrace = {
  keystrokeCount: 0,
  eraseCount: 0,
  durationMs: 0,
};

const VERDICT_META: Record<
  string,
  { label: string; bar: string; chip: string }
> = {
  not_ready: {
    label: "Not ready yet",
    bar: "bg-red-500",
    chip: "bg-red-100 text-red-800 border-red-300",
  },
  getting_there: {
    label: "Getting there",
    bar: "bg-amber-500",
    chip: "bg-amber-100 text-amber-800 border-amber-300",
  },
  ready: {
    label: "Ready for the graded version",
    bar: "bg-emerald-500",
    chip: "bg-emerald-100 text-emerald-800 border-emerald-300",
  },
};

export default function AssignmentPractice() {
  const params = useParams<{ id: string }>();
  const assignmentId = Number(params.id);

  const { data: assignment, isLoading: assignmentLoading } =
    useGetAssignment(assignmentId);
  const { data: readiness, refetch: refetchReadiness } =
    useGetAssignmentReadiness(assignmentId, {
      query: {
        enabled: Number.isFinite(assignmentId),
        queryKey: ["assignment-readiness", assignmentId],
      },
    });

  const start = useStartPracticeSession();
  const next = useNextPracticeProblem();
  const grader = useGradePracticeAnswer();
  const ask = useAskTutor();

  const [sessionId, setSessionId] = useState<number | null>(null);
  const [blueprint, setBlueprint] = useState<number[]>([]);
  const [setNumber, setSetNumber] = useState(1);
  const [index, setIndex] = useState(0);
  const [problem, setProblem] = useState<PracticeProblem | null>(null);
  const [answer, setAnswer] = useState("");
  const [trace, setTrace] = useState<KeystrokeTrace>(EMPTY_TRACE);
  const [grade, setGrade] = useState<PracticeGrade | null>(null);
  const [results, setResults] = useState<boolean[]>([]);
  const [setComplete, setSetComplete] = useState(false);

  const [tutorMsgs, setTutorMsgs] = useState<TutorMsg[]>([
    {
      role: "tutor",
      text:
        "I'm right here while you practice. Work a problem, then ask me anything about the feedback — why an answer is right, where you went wrong, or for a similar example to try.",
    },
  ]);
  const [tutorInput, setTutorInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const startedRef = useRef(false);

  const total = blueprint.length;

  function loadProblem(sid: number, idx: number, topicIds: number[]) {
    setAnswer("");
    setGrade(null);
    setTrace(EMPTY_TRACE);
    setProblem(null);
    next.mutate(
      { sessionId: sid, data: { topicId: topicIds[idx] ?? null } },
      { onSuccess: (p) => setProblem(p) },
    );
  }

  // Start the assignment-scoped practice session once the assignment is loaded.
  useEffect(() => {
    if (startedRef.current) return;
    if (!assignment) return;
    startedRef.current = true;
    const topicIds = assignment.problems.map((p) => p.topicId);
    setBlueprint(topicIds);
    start.mutate(
      {
        data: {
          assignmentId,
          weekNumber: assignment.weekNumber,
          tutorEnabled: true,
          focusOnWeaknesses: false,
        },
      },
      {
        onSuccess: (s) => {
          setSessionId(s.id);
          loadProblem(s.id, 0, topicIds);
        },
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assignment]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [tutorMsgs, ask.isPending]);

  function submit() {
    if (!sessionId || !problem) return;
    grader.mutate(
      { sessionId, data: { problemId: problem.id, answer, trace } },
      {
        onSuccess: (r) => {
          setGrade(r);
          setResults((h) => [...h, r.correct]);
          refetchReadiness();
        },
      },
    );
  }

  function goNext() {
    if (!sessionId) return;
    if (index < total - 1) {
      const ni = index + 1;
      setIndex(ni);
      loadProblem(sessionId, ni, blueprint);
    } else {
      setSetComplete(true);
      refetchReadiness();
    }
  }

  function newSet() {
    if (!sessionId) return;
    setSetNumber((n) => n + 1);
    setIndex(0);
    setResults([]);
    setSetComplete(false);
    loadProblem(sessionId, 0, blueprint);
  }

  function buildContext(): string | undefined {
    if (!problem) return undefined;
    const parts = [`Practice problem: ${problem.prompt}`];
    if (answer.trim()) parts.push(`My answer: ${answer}`);
    if (grade) {
      parts.push(`This was marked ${grade.correct ? "correct" : "incorrect"}.`);
      parts.push(`Correct answer: ${grade.correctAnswer}`);
      parts.push(`Explanation shown to me: ${grade.explanation}`);
      if (grade.tutorTip) parts.push(`Tutor tip shown to me: ${grade.tutorTip}`);
    }
    return parts.join("\n");
  }

  function sendTutor(text: string) {
    const msg = text.trim();
    if (!msg || ask.isPending) return;
    setTutorMsgs((m) => [...m, { role: "user", text: msg }]);
    setTutorInput("");
    ask.mutate(
      { data: { message: msg, context: buildContext() ?? null } },
      {
        onSuccess: (r) =>
          setTutorMsgs((m) => [...m, { role: "tutor", text: r.text }]),
        onError: () =>
          setTutorMsgs((m) => [
            ...m,
            {
              role: "tutor",
              text: "I couldn't reach the tutor just now — try again in a moment.",
            },
          ]),
      },
    );
  }

  if (!Number.isFinite(assignmentId)) {
    return (
      <Layout>
        <div className="p-8 max-w-3xl mx-auto">
          <div className="text-red-700">Invalid assignment.</div>
          <Link href="/assignments" className="text-primary underline">
            Back to assignments
          </Link>
        </div>
      </Layout>
    );
  }

  const kind = assignment?.kind ?? "homework";
  const setCorrect = results.filter(Boolean).length;
  const verdictMeta =
    (readiness && VERDICT_META[readiness.verdict]) || VERDICT_META.not_ready!;

  return (
    <Layout>
      <div className="p-6 md:p-8 max-w-6xl mx-auto w-full flex flex-col gap-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <Link
            href="/assignments"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to assignments
          </Link>
          <Link href={`/assignments/${assignmentId}`}>
            <Button variant="outline" size="sm">
              <GraduationCap className="w-4 h-4 mr-1" />
              Go to graded {kind}
            </Button>
          </Link>
        </div>

        <div className="flex flex-col gap-1">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-primary font-semibold">
            <InfinityIcon className="w-4 h-4" />
            Unlimited practice
          </div>
          <h1 className="font-serif text-3xl">
            {assignment ? `Practice: ${assignment.title}` : "Loading…"}
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Drill as many fresh problems as you want. These are{" "}
            <span className="font-semibold text-foreground">
              never the real graded questions
            </span>{" "}
            — they mirror the same topics so you can practice safely, with the
            live tutor on hand the whole time. Everything you do here feeds the
            readiness pointers below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5 items-start">
          {/* LEFT: practice flow */}
          <div className="flex flex-col gap-5">
            {/* Readiness panel */}
            <div className="bg-card border rounded-lg p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 font-semibold">
                  <Target className="w-4 h-4 text-primary" />
                  Your readiness for the graded {kind}
                </div>
                {readiness && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${verdictMeta.chip}`}
                  >
                    {verdictMeta.label}
                  </span>
                )}
              </div>
              {readiness ? (
                <>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2.5 rounded-full bg-secondary overflow-hidden">
                      <div
                        className={`h-full ${verdictMeta.bar} transition-all`}
                        style={{ width: `${readiness.readinessScore}%` }}
                      />
                    </div>
                    <span className="text-sm font-mono font-semibold w-12 text-right">
                      {readiness.readinessScore}%
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {readiness.practiceCount} practice attempt
                    {readiness.practiceCount === 1 ? "" : "s"} logged on this{" "}
                    {kind}'s topics.
                  </div>
                  <ul className="flex flex-col gap-1.5">
                    {readiness.pointers.map((p, i) => (
                      <li
                        key={i}
                        className="text-sm flex gap-2 items-start text-foreground/90"
                      >
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <Skeleton className="h-16 w-full" />
              )}
            </div>

            {/* Practice set */}
            {setComplete ? (
              <div className="bg-card border rounded-lg p-6 flex flex-col gap-4 items-start">
                <div className="inline-flex items-center gap-2 text-emerald-700 font-semibold">
                  <CheckCircle2 className="w-5 h-5" />
                  Practice {kind} #{setNumber} complete
                </div>
                <p className="text-sm text-muted-foreground">
                  You scored{" "}
                  <span className="font-semibold text-foreground">
                    {setCorrect}/{total}
                  </span>{" "}
                  on this practice set. Check the updated readiness pointers
                  above, then run another set (all-new problems) or take the real
                  graded {kind} when you're ready.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button onClick={newSet} disabled={next.isPending}>
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Generate another practice {kind}
                  </Button>
                  <Link href={`/assignments/${assignmentId}`}>
                    <Button variant="outline">
                      <GraduationCap className="w-4 h-4 mr-1" />
                      Take the graded {kind}
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Practice {kind} #{setNumber} · Problem {index + 1} of{" "}
                    {total || "…"}
                    {problem?.topicTitle ? ` · ${problem.topicTitle}` : ""}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-xs text-muted-foreground">
                      Set score: {setCorrect}/{results.length}
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        sessionId && loadProblem(sessionId, index, blueprint)
                      }
                      disabled={next.isPending || grader.isPending || !sessionId}
                    >
                      <RefreshCw className="w-4 h-4 mr-1" />
                      New problem
                    </Button>
                  </div>
                </div>

                <div className="bg-card border rounded-lg p-4 min-h-[110px]">
                  {next.isPending || start.isPending || !problem ? (
                    <div className="flex flex-col gap-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  ) : (
                    <MarkdownRenderer content={problem.prompt} />
                  )}
                </div>

                <AnswerInput
                  value={answer}
                  onChange={(val, t) => {
                    setAnswer(val);
                    setTrace(t);
                  }}
                  disabled={!!grade || !problem}
                  promptSource={problem?.prompt}
                />

                {grade ? (
                  <div
                    className={`rounded-md border p-4 ${
                      grade.correct
                        ? "bg-emerald-50 border-emerald-300"
                        : "bg-red-50 border-red-300"
                    }`}
                  >
                    <div
                      className={`flex items-center gap-2 font-semibold mb-2 ${
                        grade.correct ? "text-emerald-800" : "text-red-800"
                      }`}
                    >
                      {grade.correct ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                      {grade.correct ? "Correct" : "Not quite"}
                    </div>
                    {!grade.correct && (
                      <div className="text-sm mb-2">
                        <span className="font-semibold">Correct answer: </span>
                        <span className="font-mono">{grade.correctAnswer}</span>
                      </div>
                    )}
                    <div className="text-sm prose prose-sm max-w-none">
                      <MarkdownRenderer content={grade.explanation} />
                    </div>
                    {grade.tutorTip && (
                      <div className="mt-2 pt-2 border-t border-border/60 text-sm">
                        <span className="font-semibold">Tutor tip: </span>
                        <span className="italic text-muted-foreground">
                          {grade.tutorTip}
                        </span>
                      </div>
                    )}
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => sendTutor("Why is this the answer?")}
                        disabled={ask.isPending}
                      >
                        <Sparkles className="w-3.5 h-3.5 mr-1" />
                        Ask the tutor why
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          sendTutor("Can you give me a similar problem to try?")
                        }
                        disabled={ask.isPending}
                      >
                        Similar example
                      </Button>
                      <Button onClick={goNext} disabled={next.isPending} size="sm">
                        {index < total - 1 ? "Next problem" : "Finish set"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-end">
                    <Button
                      onClick={submit}
                      disabled={!answer.trim() || grader.isPending || !problem}
                    >
                      {grader.isPending ? "Grading…" : "Submit answer"}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* RIGHT: live tutor */}
          <div className="bg-card border rounded-lg flex flex-col h-[600px] lg:sticky lg:top-6">
            <div className="px-4 py-3 border-b flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="font-semibold">Live tutor</span>
              <span className="ml-auto text-xs text-muted-foreground">
                Always on during practice
              </span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
              {tutorMsgs.map((m, i) => (
                <div
                  key={i}
                  className={`max-w-[90%] rounded-lg px-3 py-2 text-sm ${
                    m.role === "user"
                      ? "self-end bg-primary text-primary-foreground"
                      : "self-start bg-secondary text-secondary-foreground"
                  }`}
                >
                  <MarkdownRenderer
                    content={m.text}
                    inverted={m.role === "user"}
                  />
                </div>
              ))}
              {ask.isPending && (
                <div className="self-start bg-secondary text-muted-foreground rounded-lg px-3 py-2 text-sm">
                  Thinking…
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            <form
              className="p-3 border-t flex items-end gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                sendTutor(tutorInput);
              }}
            >
              <textarea
                value={tutorInput}
                onChange={(e) => setTutorInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendTutor(tutorInput);
                  }
                }}
                placeholder="Ask about this problem or the feedback…"
                rows={2}
                className="flex-1 resize-none rounded-md border border-input bg-background p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button
                type="submit"
                size="icon"
                disabled={!tutorInput.trim() || ask.isPending}
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
