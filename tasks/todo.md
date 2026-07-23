# Port Paddock CRUD surface: dropdowns, view modals, forms, toaster

Follow-up to the table alignment. Port from ~/Projects/paddock: row-action
dropdown on DataTable rows (View/Edit), Add New button, the entity detail
modals (minus requests/packages/notes/attachments tabs), create + edit
forms, and the react-hot-toast Toaster ("Operation completed successfully"
on save). Edits/creates persist in frontend state (localStorage) only.

- [ ] 1. Primitives: Button (default/outline/destructive), Dialog,
      DropdownMenu (port), Toaster + react-hot-toast dep, mount in App
- [ ] 2. Store: createdProviders/createdVolunteers + seed-override edits
      map; create/update mutations for all three entities
- [ ] 3. DataTable: actions column with ⋯ dropdown (View/Edit) and the
      Add New button, rendered only when handlers are passed
- [ ] 4. View modals: Client (Contact Info | Services & Needs), MP and
      Volunteer (General Info | Training Records), TrainingRecordDetail on
      Records page; TrainingRecordsTable; wire dropdowns on pages
- [ ] 5. Forms: Client/Provider/Volunteer create + edit pages (Paddock
      card layout), routes, success toasts
- [ ] 6. Verify (build + Playwright: view, edit persists, create, toast,
      reset) and commit as work lands

# Align coordinator tables with the live Paddock app

Make every coordinator table identical to Paddock (columns, headers,
rendering), keeping the coloured pills for services and expiry dates but
with pill text as just the date (no "expires"/"valid to" prefix). User will
decide later what to exclude for the WCN context.

Paddock reference: ~/Projects/paddock (routes/*.tsx, components/tables/DataTable.tsx).

- [x] 1. Data: extend types + seed with Paddock fields — client customId /
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
      Records") — each with MPs | Volunteers tabs; nav + routes updated,
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
  tables — data stays in the model.
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
