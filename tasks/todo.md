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

- [ ] 1. Remove login: delete Login page/route, auth state in store, sign-in
      gate — `/coordinator` opens directly; Shell gets an exit link home
- [ ] 2. Landing: strip to the two entry cards (lucide icon + title only)
- [ ] 3. Verify: `bun run build` clean + Playwright smoke (landing → both flows)
