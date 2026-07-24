# Coordinator request match view in dashboard style (2026-07-24)

Recent Requests on the dashboard linked to the public results page, which
drops the coordinator into public chrome with no way back but Home. Give
coordinators their own match view inside the Shell, styled like the rest
of the dashboard. Plan: ~/.claude/plans/functional-growing-harbor.md

- [x] 1. RequestMatches page: dashboard-dialect request card (DetailItem
      grid, contact + questionnaire fields) + match cards (ExpiryChip
      compliance, Draft email respecting consent), Back to dashboard link
- [x] 2. Route /coordinator/requests/:requestId in Shell; dashboard cards
      link there instead of the public results page
- [x] 3. Verify: typecheck + build + Playwright (nav both ways, consent-off
      state, public flow untouched); commit

## Review

New RequestMatches page renders inside the coordinator Shell in the
dashboard dialect (gradient pageTitle + "Matches: N" pill, form-card
surfaces, DetailItem rows, labelled date ExpiryChips, primaryButton
mailto). It shows what the public page withholds from the requester's
own view: contact details, completed-by, funding, person sought,
circumstances and pet details (DetailItem skips empties). Results.tsx and
the post-questionnaire flow are untouched.

Verified via Playwright on the dev server, re-run after rebasing onto
origin/main's compliance filter: dashboard card for Iris Quick links to
/coordinator/requests/req-01 with 2 ranked matches (Josh Parkin excluded
upstream by his expired insurance, so coordinator chips only ever show
green or amber renewal-window dates); Back to dashboard returns to
/coordinator; an injected consent-off request shows the amber "emails
switched off" note and the disabled gray Draft email button; the public
results page still renders in PublicShell with tick-style compliance.
typecheck + build clean.

Follow-up candidate (flag for user): the public page's new "How matches
work" modal could also sit beside the coordinator page's matches heading.

# Match info modal + compliance filters (2026-07-23)

Results page: explain how matching works via a small info link + modal,
and tighten matching so only compliant providers appear (user request:
filter should also require in-date DBS and in-date liability insurance).

- [x] 1. matching.ts: exclude providers whose DBS check or public
      liability insurance has expired ("expiring" within 90 days still
      counts as in date); update the doc comment
- [x] 2. Results.tsx: "How matches work" link beside the matches heading
      opening a Dialog that lists the four conditions (area coverage,
      service overlap, DBS in date, insurance in date) plus the ranking
- [x] 3. Verify: bun run build clean; Playwright on /results/req-01
      (Iris's Pilton request drops 3 -> 2 matches, Josh Parkin excluded
      by his expired insurance; modal opens, reads right, closes)

## Review

Two commits: e990129 (matching filter) and 8971c63 (info modal). The
filter reuses expiryStatus, so only "expired" excludes; a provider in
the 90-day renewal window still matches. Modal copy mirrors the code's
four conditions and the ranking, with the leaf-green tick rows echoing
the DBS/Insurance ticks on the provider cards; on the public page it
uses a font-display heading, not Paddock's gradient DialogTitle.

Verified via Playwright on the dev server: /find-support/results/req-01
now shows "2 matching micro-providers" (Josh Parkin dropped, insurance
expired 30-06-2026; Deb & Ian Coombes and Martin Hobbs remain), the
link opens the modal with all four checks plus the ranking line, and
Escape closes it. Modal panel is 448px (sm:max-w-md; a plain w-[28rem]
loses to the Dialog base's w-full in Tailwind's output order, so the
override is breakpoint-scoped, keeping near-full width on phones).
Backdrop dim pixel-verified (page bg #7E7E7C under the overlay).
bun run build clean on both commits.

Side effect worth knowing: the DBS/Insurance ticks on Results cards can
now only ever render green, since non-compliant providers are filtered
out before display. Left the ticks in place as reassurance.

# Questionnaire-driven columns (user's keep/drop verdicts)

User's calls, applied 2026-07-23: keep only what the Find Support
questionnaire (or WCN operations) actually produce.

- [x] Clients: Name | Agreement Date (form submission date) | Locality |
      Funding (new, from the questionnaire's funding answer, carried onto
      created clients) | Services. No Status (no way to know a match
      happened), no Custom ID/DOB/postcode/AA/deprivation.
- [x] MPs: Name | Start Date | Locality | Areas Covered (new, with "All";
      matching now hard-filters on it intersecting the client's locality) |
      Services | Availability | Email (the Draft email address) |
      DBS Expiry | Public Liability Expiry.
- [x] Volunteers: Name | Role | Locality | Email | DBS Expiry.
- [x] Dropped fields stay in the model + detail modals; forms trimmed to
      match (dropped fields pass through untouched on edit); provider and
      client forms gained Areas Covered / Funding pickers.
- [x] Verified: table headers on all three pages, funding short labels,
      "All" areas render, Iris's Pilton request now matches 3 providers
      (Tom Vickery correctly excluded by area), trimmed form field sets,
      Tom's edit form pre-checks his six areas. Build green per commit.

Left out per verdicts: Volunteering Since (was optional, not requested).

# Port Paddock CRUD surface: dropdowns, view modals, forms, toaster

Follow-up to the table alignment. Port from ~/Projects/paddock: row-action
dropdown on DataTable rows (View/Edit), Add New button, the entity detail
modals (minus requests/packages/notes/attachments tabs), create + edit
forms, and the react-hot-toast Toaster ("Operation completed successfully"
on save). Edits/creates persist in frontend state (localStorage) only.

- [x] 1. Primitives: Button (default/outline/destructive), Dialog,
      DropdownMenu (port), Toaster + react-hot-toast dep, mount in App
- [x] 2. Store: createdProviders/createdVolunteers + seed-override edits
      map; create/update mutations for all three entities
- [x] 3. DataTable: actions column with ⋯ dropdown (View/Edit) and the
      Add New button, rendered only when handlers are passed
- [x] 4. View modals: Client (Contact Info | Services & Needs), MP and
      Volunteer (General Info | Training Records), TrainingRecordDetail on
      Records page; TrainingRecordsTable; wire dropdowns on pages
- [x] 5. Forms: Client/Provider/Volunteer create + edit pages (Paddock
      card layout), routes, success toasts
- [x] 6. Verify (build + Playwright: view, edit persists, create, toast,
      reset) and commit as work lands

## CRUD-port review

Landed as five commits (primitives → store → DataTable actions → modals →
forms), build clean on each. Verified via Playwright on the dev server:
row ⋯ menu opens View/Edit; the Micro-provider modal shows General Info
rows, services pills and the Training Records tab table; modal Edit lands
on the pre-filled form; saving an edit updates the table (Deb & Ian's DBS
pill → 25-12-2026) and writes a seed override to localStorage; Add New
creates a volunteer that appears in the table (Total: 4); the save toast
shows Paddock's "Operation completed successfully"; the Records page View
opens "Training Records Josh Parkin".

Intentionally not ported (flag for user): Delete / End / Archive /
Attachments row actions, Notes + Attachments modal tabs, requests and
packages tabs (per instruction), Paddock's FieldEditModal name-change
confirmation, Show Ended/Archived toggles, and training-record add/edit
(records display read-only in modals).

# Align coordinator tables with the live Paddock app

Make every coordinator table identical to Paddock (columns, headers,
rendering), keeping the coloured pills for services and expiry dates but
with pill text as just the date (no "expires"/"valid to" prefix). User will
decide later what to exclude for the WCN context.

Paddock reference: ~/Projects/paddock (routes/*.tsx, components/tables/DataTable.tsx).

- [x] 1. Data: extend types + seed with Paddock fields: client customId /
      dateOfBirth / postCode / attendanceAllowance / deprivation; volunteer
      dateOfBirth / postCode / dbsNumber / publicLiability* / training;
      provider dateOfBirth / postCode / dbsNumber / publicLiabilityNumber /
      feePaymentDate; rename liabilityExpiry → publicLiabilityExpiry;
      canonical core training names + coreCompletion() helper;
      formatYmdToDmy() (DD-MM-YYYY like Paddock)
- [x] 2. UI: port Paddock DataTable (title + Total pill, search, sortable
      headers with arrow icons, per-column filter row, empty-values-last
      sort) minus CRUD/permissions; minimal Tabs; ExpiryChip renders
      date-only text (label prefix stays for Results cards)
- [x] 3. Rewrite Clients / Volunteers / Micro-providers pages on DataTable
      with Paddock's exact columns + headers (Services pills kept as the
      last column on Clients + Micro-providers)
- [x] 4. Replace Compliance with Paddock's three pages: DBS ("DBS
      Records"), Public Liability ("Insurance Records"), Records ("Training
      Records"), each with MPs | Volunteers tabs; nav + routes updated,
      /coordinator/compliance redirects to /coordinator/dbs
- [x] 5. Verify: bun run build clean; Playwright pass over all coordinator
      pages + Results; commit atomically as work lands

## Decisions taken (flag to user)

- Dates in tables use Paddock's DD-MM-YYYY everywhere, including inside
  expiry pills ("just the date"). Can switch pills back to "14 Mar 2026"
  format if preferred.
- Fee Date renders raw ISO / "Unpaid" exactly as Paddock does.
- Services column kept (pills) appended after Paddock's columns; extra
  WCN-only columns (Contact, Availability, Status, headline) dropped from
  tables; data stays in the model.
- No Add New / row-action menus / Show Ended: demo data is read-only seed.

## Review

Landed as five commits (data → DataTable/Tabs/chips → entity pages →
DBS/PL/Records pages → docs), `bun run build` clean on each. Every
coordinator table now uses the ported Paddock DataTable with its exact
column sets, headers and DD-MM-YYYY dates; the DBS ("DBS Records"),
Public Liability ("Insurance Records") and Records ("Training Records")
pages carry Paddock's MPs | Volunteers tabs and network-wide Total pill.
Seed keeps its single red flag (Josh Parkin's insurance, expired
30-06-2026, sorts first on the Insurance MPs tab).

Verified via Playwright signed in as wells: all five tables' columns and
fallbacks ("Unknown" DOB, blank DOB for couples, "No DBS"-style empties
sorting last, "Unpaid" fee), expiry-date default sorts on the tabbed
pages, numeric sort on Core Completion Rate (33→100%), Locality column
filter narrowing Total to 1, /coordinator/compliance → /coordinator/dbs
redirect, and Results cards showing labelled date-only chips
("DBS 05-09-2027").

# WCN brokerage demo: build plan

Frontend-only SPA (Vite + React + TS + Tailwind v4), hardcoded in-browser data,
deployed on Vercel. Full plan: ~/.claude/plans/structured-splashing-spring.md

- [x] 1. Scaffold: Vite/React/TS/Tailwind, pk-* tokens, vercel.json SPA rewrite
- [x] 2. Data layer: types, WCN seed dataset, localStorage store + reset
- [x] 3. Shell: mock login (wells), sidebar nav, demo ribbon
- [x] 4. Find Support wizard: 6 sections, screening branch, rejection + success
- [x] 5. Results: matching, provider cards, mailto email drafts
- [x] 6. Browse pages: providers, clients, volunteers, compliance
- [x] 7. Verify: build clean + Playwright e2e (happy path, rejection, persistence)
- [x] 8. Deploy: Vercel, live at brokerage-benjosaurs-projects.vercel.app

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
      gate; `/coordinator` opens directly; Shell gets an exit link home
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
trailing whitespace) with `bun run form:check`; corrupting one word makes
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
(enquiries line only; Results banner also drops the demo aside so the
page leads with matches). Kept unchanged by user decision: the second
consent question (other networks, now load-bearing for forwarding), the
circumstances help line, the withdraw-consent note, the phone note.

Verified via Playwright: new intro paragraph (old one absent, paras 1+3
verbatim), new email help + headline on About, new consent intro with
verbatim paras 2-3, Results banner shows only the enquiries line with
matches below. Negative test: bogus override pin → hard error naming the
override. form:check green ("5 documented overrides applied"), tsc -b +
vite build clean.

Follow-up: petDetails is optional upstream (Google can't make it
conditional) but the app reveals it only on a "Yes" pets answer, now
required whenever visible (asterisk + required message; hidden path
unaffected). Verified via Playwright both ways.

Follow-up: minimal results page. Request card is now "Your request"
(headline quote, MapPin + locality row, Clock + schedule row, service
pills + Other pill + "Pets at home"/"No pets" pill; date/ref/mono type
removed). Provider cards get the same icon rows, lose the services
overlap counter, and show DBS/Insurance as ticks (clay cross when
expired, verified against Josh Parkin's expired insurance). No
font-plex remains on the page.
