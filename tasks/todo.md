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

# Remove login + bare landing page (2026-07-23)

- [x] 1. Remove login: delete Login page/route, auth state in store, sign-in
      gate — `/coordinator` opens directly; Shell gets an exit link home
- [x] 2. Landing: strip to the two entry cards (lucide icon + title only)
- [x] 3. Verify: `bun run build` clean + Playwright smoke (landing → both flows)

## Review

Two commits: e8e6c99 (remove sign-in gate) and 2709dab (bare landing).
Login page, `/coordinator/login` route and store auth (signIn/signOut/
useSignedIn, session key) are gone; PublicShell header links straight to
/coordinator and the sidebar's Sign Out became an "Exit coordinator view"
link. Landing is now just the demo ribbon plus the two cards (lucide icon
+ title, no other copy).

Verified with Playwright: landing renders only the two cards; the
coordinator card opens the dashboard directly (no redirect); the stale
/coordinator/login URL falls through the wildcard back to /. Build clean
on both commits.

Follow-up: demo ribbon dropped from the landing page too (still shown on
the public form/results and coordinator pages). Screenshot-verified the
cards stay vertically centered.

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

## Feedback round (2026-07-23)

Per user review of the new questionnaire:

- [x] /find-support renders chromeless (no demo ribbon, Paddock header or
      eyebrow); Results keeps the shell
- [x] WCN logo (cropped via ImageMagick to mark + name + tagline,
      transparent PNG in src/assets) replaces the intro's small text
- [x] Removed the mono "Section n of m · x of y answered" line and switched
      the 255 counter off IBM Plex Mono
- [x] Base rule `button:not(:disabled) { cursor: pointer }` (Tailwind v4
      preflight default); current section pill now disabled so only
      clickable pills invite a click
- [x] Sticky section header made fully opaque (no content ghosting);
      heading focus uses preventScroll
- [x] Page title → "Find a Microprovider"

Verified via Playwright: intro (logo + title only), screening at 400px
scroll shows no bleed-through, pills/radios/buttons all report
cursor=pointer, Results route still resolves inside PublicShell.

## Automatching copy overrides (2026-07-23)

Five passages described the old hand-processed pipeline; user supplied
replacement wording, applied word-for-word via an OVERRIDES layer in
scripts/sync-form-content.ts (not by editing the generated file). Each
override pins the exact upstream text it replaces: `find` must occur
exactly once in the live form or --write/--check hard-error, so WCN
editing an overridden passage forces a review; all other text is still
proven byte-exact by form:check.

Overridden: intro "we will contact you" paragraph; email help (mail-merge
warning dropped); headline title (forwarding sentence prefixed); consent
section intro (forwarding framing, rest verbatim); confirmation message
(enquiries line only — Results banner also drops the demo aside so the
page leads with matches). Kept unchanged by user decision: the second
consent question (other networks — now load-bearing for forwarding), the
circumstances help line, the withdraw-consent note, the phone note.

Verified via Playwright: new intro paragraph (old one absent, paras 1+3
verbatim), new email help + headline on About, new consent intro with
verbatim paras 2-3, Results banner shows only the enquiries line with
matches below. Negative test: bogus override pin → hard error naming the
override. form:check green ("5 documented overrides applied"), tsc -b +
vite build clean.

Follow-up: petDetails is optional upstream (Google can't make it
conditional) but the app reveals it only on a "Yes" pets answer — now
required whenever visible (asterisk + required message; hidden path
unaffected). Verified via Playwright both ways.

Follow-up: minimal results page. Request card is now "Your request"
(headline quote, MapPin + locality row, Clock + schedule row, service
pills + Other pill + "Pets at home"/"No pets" pill; date/ref/mono type
removed). Provider cards get the same icon rows, lose the services
overlap counter, and show DBS/Insurance as ticks (clay cross when
expired — verified against Josh Parkin's expired insurance). No
font-plex remains on the page.
