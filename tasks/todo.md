# WCN brokerage demo — build plan

Frontend-only SPA (Vite + React + TS + Tailwind v4), hardcoded in-browser data,
deployed on Vercel. Full plan: ~/.claude/plans/structured-splashing-spring.md

- [x] 1. Scaffold: Vite/React/TS/Tailwind, pk-* tokens, vercel.json SPA rewrite
- [x] 2. Data layer: types, WCN seed dataset, localStorage store + reset
- [x] 3. Shell: mock login (wells), sidebar nav, demo ribbon
- [x] 4. Find Support wizard: 6 sections, screening branch, rejection + success
- [x] 5. Results: matching, provider cards, mailto email drafts
- [x] 6. Browse pages: providers, clients, volunteers, compliance
- [x] 7. Verify: build clean + Playwright e2e (happy path, rejection, persistence)
- [x] 8. Deploy: Vercel — live at brokerage-benjosaurs-projects.vercel.app

## Review

Shipped as 8 commits on main (pushed). Mid-build pivots from user feedback:
top level split into two entry points (public seeker flow, no login vs
coordinator sign-in as wells) and form wording tightened to match the live
Google Form verbatim (email note, pets option, newsletter labels).

Verified via Playwright: full happy path (screening → 6-section form →
submit → 6 correctly-ranked matches → GDPR-safe mailto), rejection branch,
localStorage persistence across reload, coordinator pages (Edith flows into
requests + clients, compliance sorts Josh Parkin's expired insurance first),
mobile layout. `bun run build` clean on every commit.

# Exact form wording + ADHDX-style questionnaire (2026-07-23)

The wizard's copy paraphrased the live Google Form; replace with byte-exact
wording (typos and all) and restyle to the ADHDX questionnaire aesthetic in
pk-* brand tokens. Plan: ~/.claude/plans/elegant-dazzling-mist.md

- [x] 1. Verbatim content: scripts/sync-form-content.ts (--write/--check) +
      generated src/lib/formContent.ts; form:sync/form:check/typecheck scripts
- [x] 2. Types: SupportRequest.servicesOther / heardAboutOther (additive)
- [x] 3. UI kit: src/components/questionnaire/{SectionHeader,QuestionCard,inputs}
- [x] 4. FindSupport rewrite: intro/form/rejected views, exact wording,
      ADHDX section pages with pill header + dot radios
- [x] 5. Results: verbatim "Thank you for applying…" confirmation banner
- [x] 6. Verify: form:check byte-exact, typecheck + build, Playwright
      walkthrough (happy path, rejection branch, Other inputs, keyboard)

## Review

Shipped as 6 commits on exact-form-wording. All questionnaire copy now comes
from src/lib/formContent.ts, generated from the live Google Form's
FB_PUBLIC_LOAD_DATA_ by `bun run form:sync` and provable byte-exact (modulo
trailing whitespace) with `bun run form:check` — corrupting one word makes
the check exit 1 with a line diff. Restored content the old wizard dropped:
the intro page, the disclaimer's liability paragraph, "Other" free-text
options on services/heard-about, the withdraw-consent note, and Google's
"This is a required question" error. Known demo deviations (documented in
code): town/village stays a locality <select> for Results matching, pill
labels are app chrome, submission stays in localStorage.

Verified via Playwright on the dev server: intro → screening (blank submit
shows 5 required errors, scrolls to + focuses first errored card) → one-No
rejection page (all 4 verbatim paragraphs) → Start again clears only
screening → happy path with services Other + funding left empty → About
(pets label keeps the form's double space, petDetails conditional, 255
counter) → consent Yes/No → heard-about Other auto-selects on typing,
arrow keys move radio selection → disclaimer (liability paragraph present)
→ submit → Results shows the verbatim thank-you (triple space intact),
Other chip, 4 ranked matches with GDPR-safe mailto; record persists across
reload; no horizontal overflow at 375px. `form:check`, `tsc -b` and
`vite build` clean on every commit.
