# Research: Gestionar Proveedores

**Date**: 2026-09-11
**Feature**: [spec.md](./spec.md)

Resolves the technical unknowns for the feature. The single
`NEEDS CLARIFICATION` from the Technical Context (FR-013 role gating) is
resolved below; all other decisions are researched choices (or inherited from
the approved stack) with rationale and alternatives. The backend is **not**
ready (Q1=B), so design centers on a contract-first port + mock.

## Role gating (FR-013) — resolves NEEDS CLARIFICATION

- **Decision**: Ship a lightweight, feature-local mock session: a route guard
  on `src/routes/proveedores.tsx` (TanStack Router `beforeLoad`) that reads a
  mock auth provider assuming an authenticated user with role `ADMIN`; the
  module and its actions are only rendered when the role matches.
- **Rationale**: The scaffold has no auth yet; the ECUS04 treats an
  authenticated Administrator as a precondition (spec assumption). The guard
  encodes the access rule (FR-013) now, without inventing a real auth system.
  The seam mirrors the repository approach: swap in the real auth provider
  later without touching the feature UI.
- **Alternatives considered**: Build full auth now (out of scope, rejected);
  fake Auth0/Keycloak SDK (new dependency + consultation, rejected); no guard at
  all (violates FR-013 and spec preconditions, rejected).

## Contract-first data access (FR-014)

- **Decision**: Define the HTTP contract first (`contracts/proveedores-api.md`)
  and program against a repository **port** (`ProveedoresRepository`) with an
  in-memory mock implementation (`mock-proveedores-repository.ts`, ~25 seeded
  suppliers, simulated latency 300–700ms). TanStack Query hooks call the port.
  When the backend lands, an HTTP adapter implementing the same port replaces
  the mock without UI changes.
- **Rationale**: Q1=B mandates mock-first; the port encapsulates "where data
  comes from", so rules, pagination semantics, and error shapes are defined once
  and reused. Satisfies FR-014 and keeps the UI removable from the data source.
- **Alternatives considered**: Direct `fetch` calls in components (scattered,
  unreplaceable later, rejected); a global mock of `fetch` (hides the seam,
  rejected).

## Pagination + search with TanStack Query v5

- **Decision**: Server-style semantics (matches the contract): the port returns
  a paginated envelope `{ items, pagina, tamano, total, totalPaginas }`; the
  list hook keys on `['proveedores', { texto, pagina }]` and uses
  `placeholderData: keepPreviousData` (the v5 API replacing the removed
  `keepPreviousData: true`) so page changes keep the old rows visible until the
  new page arrives, plus a 300ms debounced search term in the query key.
- **Rationale**: Verified against the official TanStack Query v5 docs
  ([paginated-queries](https://tanstack.com/query/v5/docs/framework/react/guides/paginated-queries)).
  Picking `keepPreviousData` from `@tanstack/react-query` avoids loading
  flicker (SC-002) and debouncing avoids a refetch per keystroke.
- **Alternatives considered**: Client-side filtering of a single all-suppliers
  query (breaks contract-first semantics and scales poorly, rejected);
  `useInfiniteQuery` (not a page-table UX, rejected).

## Form validation (FR-006, FR-007, FR-008)

- **Decision**: Hand-rolled validation module `logic/validation.ts` with pure
  functions (`validarRuc`: 11 digits numeric; `validarEmail`; `validarTelefono`;
  aggregate per-field error map) fully covered by node logic tests; components
  render the error map with accessible error messages. Duplicate RUC is
  detected by the repository (unique key) and surfaced as a blocking alert
  (FR-007).
- **Rationale**: No new dependency (constitution dependency rule). The logic is
  pure and testable in the `node` environment, exactly the pattern of 001's
  `build-greeting`.
- **Alternatives considered**: `react-hook-form` (new dependency, rejected);
  `zod` (new dependency, deferred as in 001 — can be proposed later via
  consultation).

## Fiscal autocomplete + failure handling (FR-005, Q3=B)

- **Decision**: On RUC/NIT input (≥ 11 digits), a TanStack Query lookup calls
  port method `getDatosFiscales(ruc)` which returns `{ razonSocial, nombreComercial,
  direccion }`. If it throws (404/no data or network/timeout), the form shows a
  blocking error with a **reintentar** action and disallows continuing until
  data is recovered (Q3=B, US-2 acceptance 5). Success populates the
  Identificación/Ubicación fields.
- **Rationale**: Q3=B decided by the user; the throw-on-miss contract makes the
  "block until fiscal data" rule explicit and testable; TanStack Query gives
  retry + refetch for free.
- **Alternatives considered**: Continue without fiscal data silently (Q3=A,
  rejected); non-blocking warning (Q3=B variant, rejected).

## Notifications/toast (FR-012)

- **Decision**: Minimal `stores/toast-store.ts` (Zustand) holding a queue of
  `{ id, tone: 'success' | 'error', message }`; a small `features/proveedores/components/toast.tsx`
  renders the queue; helpers `notificarExito/notificarError` fire after
  register/update/deactivate/reactivate. ARIA live region for screen readers.
- **Rationale**: FR-012 requires feedback; Zustand is the mandated shared-state
  store; hand-rolled avoids a new dependency.
- **Alternatives considered**: `sonner` (new dependency, rejected per rule);
  inline per-component alerts (not global, duplicative, rejected).

## UI primitives (approved set via shadcn)

- **Decision**: Add shadcn primitives `table`, `dialog`, `input`, `label`,
  `badge`, `select` via `npx shadcn add` (components.json flow), consistent with
  ADR-0001; all styled with theme tokens (light/dark). Confirm dialogs reuse
  `dialog`. Icons from `@phosphor-icons/react`.
- **Rationale**: These are approved additions of the existing design system,
  not new dependencies; Radix under the hood satisfies Principle VI.
- **Alternatives considered**: Hand-rolling primitives (inconsistent styling,
  rejected); adding other component libraries (new dependency, rejected).

## Dialogs / confirmation flows (US-4, US-5)

- **Decision**: All modals (register, edit, deactivate confirm, reactivate
  confirm) are Radix `Dialog`-based: focus trap, close-on-overlay, labelled
  content, cancel/save buttons. Reveactivation uses the Figma copy
  "¿Deseas reactivar a {nombre}? Volverá a estar disponible en el sistema."
  with "Cancelar" and "Sí, activar"; deactivation mirrors it with confirmed
  soft-delete semantics.
- **Rationale**: Radix primitives inherit correct ARIA (Principle VI); the
  confirm-before-mutate rule (FR-009/FR-015) is UI-enforced plus logic-verified.
- **Alternatives considered**: Native `window.confirm` (not stylable, poor a11y,
  rejected); custom ARIA dialogs (error-prone, rejected).

## Errors / empty / loading states (FR-011)

- **Decision**: `proveedores-states.tsx` centralizes three explicit states —
  loading (skeleton + aria-busy), error (message + "Reintentar" refetch),
  empty (no suppliers → CTA to register; no results → prompt to adjust the
  search). List errors distinguish "failed to load" from "no results".
- **Rationale**: FR-011 and constitution Principle V require explicit states.
- **Alternatives considered**: Relying on TanStack Query defaults alone (no
  designed empty/error UX, rejected).

## Deferred / follow-ups (documented, not in scope)

- Real backend integration for `GET/POST/PUT/PATCH /proveedores` and
  `GET /proveedores/fiscales/:ruc` → swap the mock adapter (FR-014).
- Real authentication with Admin RBAC → replace the mock route guard (FR-013).
- `react-hook-form`/`zod`/`sonner` adoption if validation or toasts grow →
  requires prior consultation (dependency rule).