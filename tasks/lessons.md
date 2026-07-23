# Lessons

## Content that mirrors an external source must be verbatim, not "tightened"

The Find Support wizard originally paraphrased ("tightened") the live Google
Form's questions and descriptions while todo.md claimed the wording matched
"verbatim". The user had to correct this: when copy mirrors a real external
source, reproduce it byte-for-byte — typos, double spaces, dashes and all —
unless explicitly asked to edit it. Editorial improvement of someone else's
canonical text is a bug, not a favour.

Rule: never hand-transcribe such content. Generate it from the source
(scripts/sync-form-content.ts --write) and keep a drift check
(`bun run form:check`) so "matches the source" is a proven property, not a
claim. Any deliberate deviation (control type, chrome labels) gets called
out in the plan/docs instead of silently blended in.
