# Lessons

- **Never gate a commit on a piped build.** `bun run build 2>&1 | tail -3 &&
  git commit` commits even when the build fails, because the pipeline's exit
  code is tail's. Run the build bare (`bun run build > log 2>&1 && tail log`)
  or check its status before chaining git. Caught 2026-07-23 when a red
  build slipped into a commit and needed an amend.
- **`git add -A` sweeps up tool artifacts.** The Playwright MCP writes
  `.playwright-mcp/` into the repo cwd; two of its logs got committed and
  needed a filter-branch to remove. Gitignore tool scratch dirs up front,
  and prefer staging explicit paths over `-A` when artifacts may exist.
- **Take "no other text" literally, including site-wide chrome.** When Ben
  says a page should have *just* X and no other text, that includes fixtures
  like the demo ribbon; don't keep them on a judgment call. If chrome seems
  load-bearing, still remove it from the named page and note it survives
  elsewhere, rather than keeping it and flagging. (2026-07-23: kept the demo
  ribbon on the simplified landing; correction was "drop demo ribbon".)

## Content that mirrors an external source must be verbatim, not "tightened"

The Find Support wizard originally paraphrased ("tightened") the live Google
Form's questions and descriptions while todo.md claimed the wording matched
"verbatim". The user had to correct this: when copy mirrors a real external
source, reproduce it byte-for-byte (typos, double spaces, dashes and all)
unless explicitly asked to edit it. Editorial improvement of someone else's
canonical text is a bug, not a favour.

Rule: never hand-transcribe such content. Generate it from the source
(scripts/sync-form-content.ts --write) and keep a drift check
(`bun run form:check`) so "matches the source" is a proven property, not a
claim. Any deliberate deviation (control type, chrome labels) gets called
out in the plan/docs instead of silently blended in.
