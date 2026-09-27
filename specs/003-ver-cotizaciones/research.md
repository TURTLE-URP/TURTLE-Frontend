# Research: Ver Cotizaciones

**Date**: 2026-09-27
**Feature**: [spec.md](./spec.md)

Resolves the technical unknowns for the feature. There are no `NEEDS CLARIFICATION`
items left in the Technical Context (stack is constitution-mandated; behavior was
settled in the clarification sessions). All decisions below are researched choices
or patterns inherited from 002-gestionar-proveedores, with rationale and
alternatives. The backend is **not ready** (spec Q5=B), so design centers on a
contract-first port + mock.

## Contract-first data access (spec Q5=B, FR-012)

- **Decision**: Define the HTTP contract first (`contracts/cotizaciones-api.md`)
  and program against a repository **port** (`CotizacionesRepository`) with an
  in-memory mock implementation (`mock-cotizaciones-repository.ts`, ~25 seeded
  quotations spanning solicitud estados, simulated latency 300–700ms). TanStack
  Query hooks call the port. When the backend lands, an HTTP adapter implementing
  the same port replaces the mock without UI changes.
- **Rationale**: Direct reuse of the proven 002 pattern; the port encapsulates
  "where data comes from" so search/filter/pagination semantics and error shapes
  are defined once. Satisfies FR-012 and keeps the UI removable from the data source.
- **Alternatives considered**: Direct `fetch` calls in components (scattered,
  unreplaceable later, rejected); global `fetch` mock (hides the seam, rejected).

## Search + filters + pagination with TanStack Query v5 (FR-003, FR-004, FR-005, FR-016)

- **Decision**: Server-style semantics (matches the contract): the port returns a
  paginated envelope `{ items, pagina, tamano, total, totalPaginas }`; the list
  hook keys on `['cotizaciones', { texto, estado, desde, hasta, pagina }]` and uses
  `placeholderData: keepPreviousData` (v5 API) so page changes keep old rows
  visible until the new page arrives. Search input debounced ~300ms in the query
  key. Any change to `texto`/`estado`/`desde`/`hasta` resets `pagina` to 1
  (FR-016); prev/next buttons are disabled at the first/last page (FR-016).
- **Rationale**: Same verified v5 pattern as 002 (official paginated-queries
  guide); debouncing avoids a refetch per keystroke; reset-to-page-1 is the
  user-chosen option A and prevents out-of-range pages after filtering.
- **Alternatives considered**: Client-side filtering of one big query (breaks
  contract-first semantics, rejected); option B/C pagination behaviors
  (user explicitly chose A, rejected).

## Action availability matrix as pure logic (FR-006, FR-009, FR-010, FR-011)

- **Decision**: Pure module `logic/acciones.ts` exposing
  `accionesDisponibles(cotizacion) → { cerrar: { habilitada, motivo? }, verOrden: { habilitada, motivo? }, verDetalle: { habilitada: true } }`,
  fully covered by node logic tests. Rules: `verOrden` enabled only when
  `solicitudEstado === 'aprobada'`; `cerrar` enabled only when
  `'en negociación'`; `verDetalle` always enabled. Components render only what
  the matrix returns.
- **Rationale**: Business rules verified at logic level (fast, deterministic),
  exactly the constitution's logic-vs-component split; UI cannot drift from the rules.
- **Alternatives considered**: Inline ternaries in the row component (untestable
  in node env, duplicative, rejected).

## Disabled-with-reason presentation (spec Q3=B, FR-010, FR-011)

- **Decision**: Disabled actions render as Radix `Tooltip`-wrapped buttons
  (`disabled` + visible trigger) showing the motivo (e.g. "Disponible solo si la
  solicitud está aprobada"). Tooltip comes from the already-installed `radix-ui`
  meta-package — no new dependency.
- **Rationale**: User chose option B; Radix inherits correct ARIA/keyboard
  behavior (Principle VI); the motivo strings are produced by `acciones.ts` so
  they are logic-tested, not hardcoded per render.
- **Alternatives considered**: `title` attribute only (not keyboard/AT-visible,
  rejected); hiding the action (user chose B over A, rejected); new tooltip
  library (dependency rule, rejected).

## New-tab derivations (FR-008, FR-009)

- **Decision**: "Ver Orden de Compra" and "Ver detalles" render as links opening
  the target routes in a new tab (`target="_blank"`, `rel="noreferrer"`); target
  routes (`/ordenes-compra/:id`, `/cotizaciones/:id`) belong to the follow-up
  extended flows and are out of scope here — this feature ships the derivation
  points and documents the seam. If the browser blocks the tab, show the
  guidance message from the spec assumption.
- **Rationale**: Spec mandates new-tab behavior; internal router links keep SPA
  semantics; documenting (not building) the targets keeps scope bounded.
- **Alternatives considered**: Same-tab navigation (contradicts spec, rejected);
  building the detail views now (extended flows, out of scope, rejected).

## Close-quotation modal seam (FR-007)

- **Decision**: This feature renders the row trigger and opens a Radix `Dialog`
  shell; the closure form content is owned by the follow-up Cerrar Cotización
  flow. The dialog is designed as the integration seam (content slot), so the
  follow-up plugs its form in without touching this feature's table or actions.
- **Rationale**: FR-007 requires the modal entry point now, but the flow itself
  is explicitly out of scope; a shell-with-slot avoids both scope creep and rework.
- **Alternatives considered**: Building the closure form now (out of scope,
  rejected); a dead button with no dialog (violates FR-007 acceptance, rejected).

## Explicit states (FR-013, FR-014)

- **Decision**: `cotizaciones-states.tsx` centralizes four explicit states —
  loading (skeleton + `aria-busy`), load error (message + "Reintentar" refetch),
  empty master (message A: no quotations registered), no-results (message B:
  echoes the used search/filter criteria). User chose two distinct messages
  (option A).
- **Rationale**: FR-013/FR-014 + Principle V require explicit states; echoing
  the criteria in message B tells the admin exactly what to adjust.
- **Alternatives considered**: Single generic message (user chose A, rejected);
  TanStack Query defaults alone (no designed empty/error UX, rejected).

## Route guard / admin-only access (FR-001)

- **Decision**: Reuse the 002 mock-session pattern: TanStack Router `beforeLoad`
  guard on the existing `src/routes/catalogos/cotizaciones.tsx`
  (`/catalogos/cotizaciones`, apartado de maestros) reading the mock auth provider
  (authenticated `ADMIN`); non-admin gets the no-access view. Real auth replaces
  the provider later without touching the feature UI.
- **Rationale**: Spec precondition (authenticated Administrator); consistent
  with the sibling module; no real auth system invented.
- **Alternatives considered**: No guard (violates FR-001, rejected); full auth
  now (out of scope, rejected).

## UI primitives (approved set via shadcn)

- **Decision**: Reuse/add shadcn primitives `table`, `input`, `label`, `badge`,
  `select`, `dialog`, `tooltip` via `npx shadcn add` (components.json flow, ADR-0001
  pattern from 002); theme tokens for light/dark; icons from
  `@phosphor-icons/react`.
- **Rationale**: Approved additions of the existing design system, not new
  dependencies; Radix under the hood satisfies Principle VI.
- **Alternatives considered**: Hand-rolled primitives (inconsistent, rejected);
  other component libraries (new dependency, rejected).

## Deferred / follow-ups (documented, not in scope)

- Real backend integration (`GET /cotizaciones`, later the extended flows'
  endpoints) → swap the mock adapter.
- Real authentication with Admin RBAC → replace the mock route guard.
- Extended flows: Cerrar Cotización (dialog content), Ver Orden de Compra and
  Ver Cotización detail routes/target pages.
