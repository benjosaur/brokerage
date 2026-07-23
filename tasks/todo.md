# Align coordinator tables with the live Paddock app

Make every coordinator table identical to Paddock (columns, headers,
rendering), keeping the coloured pills for services and expiry dates but
with pill text as just the date (no "expires"/"valid to" prefix). User will
decide later what to exclude for the WCN context.

Paddock reference: ~/Projects/paddock (routes/*.tsx, components/tables/DataTable.tsx).

- [ ] 1. Data: extend types + seed with Paddock fields — client customId /
      dateOfBirth / postCode / attendanceAllowance / deprivation; volunteer
      dateOfBirth / postCode / dbsNumber / publicLiability* / training;
      provider dateOfBirth / postCode / dbsNumber / publicLiabilityNumber /
      feePaymentDate; rename liabilityExpiry → publicLiabilityExpiry;
      canonical core training names + coreCompletion() helper;
      formatYmdToDmy() (DD-MM-YYYY like Paddock)
- [ ] 2. UI: port Paddock DataTable (title + Total pill, search, sortable
      headers with arrow icons, per-column filter row, empty-values-last
      sort) minus CRUD/permissions; minimal Tabs; ExpiryChip renders
      date-only text (label prefix stays for Results cards)
- [ ] 3. Rewrite Clients / Volunteers / Micro-providers pages on DataTable
      with Paddock's exact columns + headers (Services pills kept as the
      last column on Clients + Micro-providers)
- [ ] 4. Replace Compliance with Paddock's three pages: DBS ("DBS
      Records"), Public Liability ("Insurance Records"), Records ("Training
      Records") — each with MPs | Volunteers tabs; nav + routes updated,
      /coordinator/compliance redirects to /coordinator/dbs
- [ ] 5. Verify: bun run build clean; Playwright pass over all coordinator
      pages + Results; commit atomically as work lands

## Decisions taken (flag to user)

- Dates in tables use Paddock's DD-MM-YYYY everywhere, including inside
  expiry pills ("just the date"). Can switch pills back to "14 Mar 2026"
  format if preferred.
- Fee Date renders raw ISO / "Unpaid" exactly as Paddock does.
- Services column kept (pills) appended after Paddock's columns; extra
  WCN-only columns (Contact, Availability, Status, headline) dropped from
  tables — data stays in the model.
- No Add New / row-action menus / Show Ended: demo data is read-only seed.
