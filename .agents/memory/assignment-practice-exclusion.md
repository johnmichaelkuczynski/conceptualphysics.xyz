---
name: Assignment practice never-reuse guarantee
description: Why assignment-scoped practice excludes graded prompts server-side, not just via the LLM prompt.
---

# Assignment-scoped practice must NOT reuse real graded problems

The practice-generation endpoint (`/practice/sessions/:id/next`) passes an
`avoidPrompts` list to the LLM, but the LLM hint is best-effort only. The hard
guarantee is enforced in code: normalize the generated prompt (lowercase, strip
non-alphanumerics, collapse whitespace) and reject it if it collides with the
banned set (the assignment's real graded prompts + recent session prompts),
regenerating up to a capped number of attempts. The deterministic fallback is
tagged with a unique token so it can never normalize-equal a graded prompt.

**Why:** Requirement (a) for the unlimited-practice feature was *absolute* — a
probabilistic LLM instruction is not sufficient; a graded question leaking into
practice defeats the whole point. Code review flagged the prompt-only approach
as a blocking failure.

**How to apply:** Any future "generate something that must differ from a known
set" path needs a post-generation collision check + regenerate loop, not just a
natural-language constraint in the system prompt. A practice session is bound to
an assignment via the nullable `assignmentId` on the practice sessions table.
