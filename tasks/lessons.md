# Lessons

- **Never gate a commit on a piped build.** `bun run build 2>&1 | tail -3 &&
  git commit` commits even when the build fails, because the pipeline's exit
  code is tail's. Run the build bare (`bun run build > log 2>&1 && tail log`)
  or check its status before chaining git. Caught 2026-07-23 when a red
  build slipped into a commit and needed an amend.
