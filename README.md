# Wells Community Network — Brokerage Demo

A frontend-only demo of a micro-provider brokerage tool for Wells Community
Network (Wells & Shepton Mallet, Somerset), styled as "Paddock for WCN".
It replicates WCN's real "Support Near You – Find a Micro-provider"
onboarding form, then matches the request against sample micro-providers
and drafts a GDPR-safe email to each match.

**Everything is sample data.** All people are fictional (fiction-range
phone numbers, example.org emails), all data lives in the browser
(hardcoded seed + localStorage), and nothing is ever sent anywhere.

## Two entry points

- **I'm looking for a micro-provider** — the public form → screening gate
  (with the real rejection branch) → matched providers → `mailto:` drafts.
- **I'm a WCN coordinator** — sign in as `wells` (any password) for the
  management view: requests, clients, micro-providers, volunteers, and the
  DBS, public liability and training record pages.

## Develop

```bash
bun install
bun run dev      # local dev server
bun run build    # type-check + production build to dist/
```

## Deploy

Static Vite SPA on Vercel — `vercel.json` rewrites all routes to
`index.html`. Deploy with `vercel --prod`, or import the GitHub repo in
the Vercel dashboard for auto-deploys on push.
