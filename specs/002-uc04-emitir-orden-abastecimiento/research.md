# Research: CUS04 — Emitir Orden de Abastecimiento

**Branch**: `feature/implement-UC04` | **Date**: 2026-08-09 | **Spec**: [spec.md](./spec.md)

Phase 0 output of `/speckit.plan`. Resolves the unknowns from the Technical
Context using the existing scaffold (`001-project-init`) as ground truth.

## R1 — Lazy route + role guard (assumption: guard stub)

- **Decision**: New file route `src/routes/abastecimiento.tsx` created with
  `createFileRoute('/abastecimiento')`. TanStack Router file-based routes are
  code-split automatically (lazy by default via the `tanstackRouter` Vite
  plugin). It renders inside the existing root layout (`__root.tsx` shell:
  header/footer), so the scaffold shell is preserved.
- **Guard**: implemented with `beforeLoad` on the route calling
  `requireAdmin()` from `logic/role.ts` and throwing `redirect` to `/` when
  the role is not `admin`. `role.ts` exposes `getCurrentRole(): Role` reading
  a stub constant (replaced later by the real auth module). Route-level
  `beforeLoad` runs before render and keeps the protection declarative.
- **Rationale**: automatic code splitting without extra config; `beforeLoad`
  is the router-native guard hook; stub isolates the auth dependency (swap
  target documented in the spec assumptions).
- **Alternatives considered**: (a) component-level conditional render —
  rejected: runs after render and is easy to bypass; (b) a parent layout
  route group — rejected: adds a route level without need; the single route
  is enough.

## R2 — shadcn primitives (dialog, radio-group, badge, table, input, label)

- **Decision**: `npx shadcn add dialog radio-group badge table input label`
  with the configured preset (`style: radix-lyra`, icon library: phosphor).
  This is the mandated generation path (base contract `components.md`,
  `components.json`).
- **Rationale**: Radix primitives are mandated by constitution Principle VI
  for complex widgets (dialog, radios); `badge`/`table`/`input`/`label` are
  dependency-light and theme-token driven.
- **Dependency check**: the repo already ships the `radix-ui` umbrella
  package (v1.6.7); the generated primitives import from it, so the shadcn
  generation itself adds no npm dependency. The form-validation stack
  (zod + react-hook-form) is a separate, explicitly approved addition (R7).
- **Alternatives considered**: hand-rolling wrappers around `radix-ui` —
  rejected: shadcn generation keeps primitives consistent with the rest of
  the app.

## R3 — Server state: mock API layer + TanStack Query

- **Decision**: All server state goes through TanStack Query hooks defined in
  `logic/api/hooks.ts` (`useSupplyOrders`, `useKpis`, `useCatalog`,
  `useCalculateItems`, `useEmitOrders`). The mock lives in
  `logic/api/mock.ts` implementing the exact function shapes in
  `contracts/api.md` (swap 1:1 for the real backend). Hooks never expose
  `fetch`; components never call hooks' data sources directly.
- **Rationale**: matches the resolved assumptions (no backend this
  iteration; backend calculates); keeps components immutable to the data
  source change (migration checklist in `api.md`).
- **Key detail**: `useCalculateItems` is a `useMutation` (POST semantics)
  whose response (calculated `OrderItem[]`) feeds `StepAssign`; `emitOrders`
  is a mutation returning `{ orders, sendStatus }` (deterministic per
  supplier). Query keys are namespaced (`['supply-orders']`,
  `['supply-orders','kpis']`, `['catalog']`).
- **Alternatives considered**: (a) plain async functions with local
  state — rejected: loses cache/refetch/error semantics mandated by
  FR-008; (b) Zustand for server data — rejected: constitution mandates
  TanStack Query for server state.

## R4 — DTO ↔ domain mapping and validation (Principle IV)

- **Decision**: `logic/api/dtos.ts` holds raw DTO types; `logic/api/mappers.ts`
  holds `fromXxxDto` functions plus hand-written type guards that validate and
  convert into domain types from `logic/types.ts`. A validation failure is
  treated as an error state in the hook consumer (never rendered raw).
  The form-validation decision (zod + react-hook-form) is scoped to wizard
  form state (R7) and does not change this DTO boundary; zod is now available
  for future DTO validation but the current DTO validation stays with type
  guards (cheap, no schema dependency for server data).
- **Rationale**: external data MUST be validated before use (Principle IV);
  the mock already returns domain-shaped data, but the mapper layer is kept
  so the swap to real backend JSON (snake_case) is localized.
- **Alternatives considered**: validating inline in components — rejected
  (duplication); `zod` schemas for DTOs — deferred until the real JSON Schema
  arrives (zod is already a direct dep if the team later prefers it).

## R5 — Currency/quantity formatting

- **Decision**: `formatCurrency` uses
  `Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' })`; it
  replaces the prototype's `S/ ${n.toFixed(2)}` (same output, locale-safe).
  Quantities display with `step 0.5` in free modality; aggregated dish/shortage
  quantities are rounded to 1 decimal like the prototype.
- **Rationale**: consistency with the resolved clarification (no hardcoded
  template) and WCAG/UX for numeric cells (`font-mono`).
- **Alternatives considered**: `toFixed` template — rejected in spec review.

## R6 — Component tests with Radix + Testing Library

- **Decision**: Co-located `*.test.tsx` per component using Vitest Browser
  Mode (Playwright/Chromium), Testing Library + `user-event`, following the
  `001-project-init` pattern (`greeting-card.test.tsx`). Radix dialog/radio
  interactions are exercised through their public ARIA surface
  (`aria-expanded`, `aria-checked`, dialog labelled by title).
- **Rationale**: constitution Principle III mandates per-component Browser
  Mode tests; Radix already provides correct keyboard/focus behavior, so
  tests assert behavior rather than reimplementing it.
- **Alternatives considered**: static testing without browser — rejected by
  constitution (Browser Mode mandatory).

## R7 — Form validation: zod + react-hook-form

- **Decision**: Added as direct dependencies (approved via consultation):
  `zod@^4.4.3`, `react-hook-form@^7.85.0`, `@hookform/resolvers@^5.7.1`.
  Each form step (`StepModality`, `StepConfigure`, `StepAssign`) uses
  `useForm` with a per-step zod schema and `zodResolver`, driving the
  per-step "Continuar disabled" rules and inline validation. Validation
  state stays in the form; calculation logic stays in `logic/`.
- **Version compatibility / no conflicts**: `zod@4.4.3` is the same version
  already hoisted by the tooling (`@tanstack/router-plugin`,
  `eslint-plugin-react-hooks`, shadcn MCP stack), so npm dedupes it — no
  duplicate v4 tree. The shadcn CLI's nested `zod@3.25.76` is untouched.
  `@hookform/resolvers@5.7.1` peers: `zod ^3.25 || ^4` and
  `react-hook-form ^7.55` (all other peers are optional, so the install pulls
  no extra validators). Resolver for zod v4: `zodResolver`
  (`@hookform/resolvers/zod`) or `standardSchemaResolver`.
- **Bundle impact**: zod v4 (small gzip), react-hook-form (~11 kB gzip),
  resolvers (~1 kB) — within the feature's performance budget; the lazy route
  keeps them out of the initial chunk.
- **Alternatives considered**: (a) react-hook-form without a resolver +
  manual schema — rejected: duplicate validation logic; (b) pure zod
  `.safeParse` on the whole wizard state — rejected: loses per-field binding;
  (c) hand-rolled validation per the original plan — rejected by the team
  decision to use zod for form components.
