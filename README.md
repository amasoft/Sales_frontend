# Chingi POS — Sales Management System (v2)

A rebuilt, production-grade front end for the POS / inventory / sales tracking
system previously in `sales_management_system_frontend`. Same business domain,
same backend contract — new architecture, new design system, and a UI built
around the actual workflow of a cashier and a shop owner instead of a generic
admin-dashboard template.

## Why a rewrite instead of an iteration

The previous app was built on `create-react-app` + DaisyUI + a mix of
`react-toastify`/`react-notifications`, `moment`/`dayjs`, and page-level
`useState` + raw `axios` calls duplicated across every screen (see
`ListAllProducts.js`, `SalesHistory.js`, `AddSalese.js` for three independent,
slightly-different implementations of "fetch, loading, error, toast"). Forms
had no validation library, several routes were half-migrated ("Make Sales (new
UI)" existed alongside the old one), and most of the sidebar pointed at demo
pages from the original admin-dashboard template (Leads, Transactions,
Integrations, Calendar, Documentation) that have nothing to do with a POS.

This version keeps the parts that worked — the real API contract, the Naira
currency formatting, the receipt layout — and rebuilds everything else:

- **Vite + React 18 + TypeScript** instead of CRA (`react-scripts` is
  unmaintained; Vite gives instant HMR and a much smaller, faster build).
- **A real design system** in `src/components/ui`, built on unstyled
  [Radix UI](https://www.radix-ui.com/) primitives + Tailwind, matching the
  approved visual spec in `../sales_management_system_frontend/docs/pos-ui-ux-visual-design.html`.
  **No DaisyUI** — every control (button, select, dialog, drawer, table,
  dropdown, tooltip, tabs, switch) is purpose-built and themeable through CSS
  variables, so the product isn't locked into a third-party component theme.
- **RTK Query** for all server state (`src/api/*Api.ts`) — replaces manual
  `useState`/`useEffect`/`axios` triplication with typed hooks that handle
  loading, error, caching, and cache invalidation automatically.
- **React Hook Form + Zod** for every form (login, product, customer,
  business settings) — replaces hand-rolled validation that only existed on
  some forms and not others.
- **Recharts**, not Chart.js — declarative, composable, and the categorical
  colors used in the dashboard were run through a CVD-safety validator (see
  "Chart colors" below) rather than picked by eye.
- **date-fns**, not `moment` *and* `dayjs` side by side (the old
  `package.json` shipped both).
- **Sonner**, not `react-toastify` *and* `react-notifications` side by side.

## What's in scope

Screens map to the PRD's MVP scope
(`../sales_management_system_frontend/docs/pos-inventory-sales-tracking-prd.html`):

| Screen | Route | Notes |
|---|---|---|
| Login / Register / Forgot password | `/login`, `/register`, `/forgot-password` | See "Authentication" below |
| Dashboard | `/app/dashboard` | Revenue, profit, low-stock, sales trend, payment mix, top products, recent sales |
| Make Sale (POS) | `/app/pos` | Product search/grid, cart, customer picker, discount, tax, payment method, hold/resume sale, receipt |
| Products | `/app/products` | Search/filter/paginate, add/edit drawer, delete with confirmation, stock-status badges |
| Sales History | `/app/sales` | Search/filter, sale detail drawer, reprint receipt, CSV export |
| Customers | `/app/customers` | Search, add customer, purchase history + lifetime spend per customer |
| Settings | `/app/settings` | Business profile (used on receipts), account info |

Deliberately **out of scope** for this rebuild: Reports/Analytics, Returns &
Refunds, Suppliers & Purchases, multi-user management, and the unrelated demo
pages from the original admin template (Leads, Transactions, Integrations,
Calendar, Documentation, Blank/404 test pages). These are real PRD modules for
a *later* iteration, not something to fake with placeholder UI now.

## Backend contract

This app talks to the same backend as the original — `VITE_API_BASE_URL`
(default `http://localhost:4000/api/v1`). Endpoints actually observed in the
original app's working code (not just the PRD's aspirational list):

- `GET/POST /products`, `PUT/DELETE /products/:id` — the original `PUT` had no
  `:id` in the URL (see `UpdateProductModal.js`), which meant it could only
  ever update one arbitrary product; this version fixes that to a proper
  REST path.
- `GET/POST /customer` (singular — matches the working fetch call in
  `AddSalese.js`, not the PRD's `/customers`).
- `GET/POST /sales` — response shapes for both are mirrored exactly in
  `src/types/index.ts` (`SaleRecord`, `CreateSaleResult`) from the real
  payloads found in `SalesHistory.js`, `SaleDetailModal.js`, and `Receipt.js`.

**Dashboard summary is computed client-side** (`src/lib/analytics.ts`) from
the already-fetched products + sales lists, rather than depending on the
PRD's `GET /dashboard/summary`, which isn't implemented anywhere in the
current backend. If/when that endpoint exists, swap the dashboard page to
call it directly.

**Business profile** (name/address/phone/tax rate/receipt footer) is stored
in `localStorage` via `settingsSlice`, seeded from `.env` — there's no
settings endpoint in the current backend contract, and inventing one client
side would just be a fiction. Wire it to a real `/settings` endpoint later
and this becomes a one-file change.

### Authentication

The old app didn't really authenticate — `Login.js` wrote a hardcoded string
to `localStorage` and redirected. This version calls a real
`POST /auth/login` (see `src/api/authApi.ts`), because that's what the PRD
specifies and what `createdById` on every sale needs to be trustworthy. That
endpoint doesn't exist in the backend yet, so the login screen also offers
**"Continue in demo mode"** — an explicit, clearly-labeled button (not a
silent fallback) that opens the app with a local session so the UI can be
evaluated end to end before `/auth/login` is wired up. Remove it once real
auth is live.

## Chart colors

Dashboard charts use a categorical palette (`src/components/charts/chartColors.ts`)
validated against this app's actual light/dark panel surfaces with the
color-vision-deficiency validator described in the project's data-viz
guidelines — lightness band, chroma floor, adjacent-pair CVD separation, and
contrast all pass for both themes. Don't hand-edit those hex values without
re-running the validator.

## Project structure

```
src/
  api/            RTK Query slices (one file per resource)
  app/            Redux store + typed hooks
  components/
    ui/           Design-system primitives (Button, Input, Dialog, Table, ...)
    layout/        App shell: Sidebar, Topbar, GlobalSearch, UserMenu, ...
    charts/        Recharts wrappers + validated color palette
    receipt/       Shared printable receipt document + dialog
    customers/     Shared customer-create dialog (used by POS + Customers page)
  features/
    auth/          Session slice + route guards
    ui/            Sidebar/theme/page-title UI state
    settings/      Business profile slice
  lib/            Formatting, validation schemas, stock status, analytics, CSV export
  pages/          One folder per route; page-only components live alongside their page
  routes/         Router config + sidebar nav config
  types/          Domain types mirroring the real backend payloads
```

## Getting started

```bash
cp .env.example .env   # point VITE_API_BASE_URL at your backend
npm install
npm run dev
```

Open the app and either sign in against a real `/auth/login` endpoint or
click **"Continue in demo mode"** to explore the UI immediately.

```bash
npm run typecheck   # tsc --noEmit
npm run lint         # eslint
npm run build         # production build
```
