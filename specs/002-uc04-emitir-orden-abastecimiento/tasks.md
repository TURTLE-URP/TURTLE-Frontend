# Tasks: Emitir Orden de Abastecimiento (CUS04)

**Input**: Design documents from `/specs/002-uc04-emitir-orden-abastecimiento/`

**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/, quickstart.md

**Tests**: FR-012 + constitution Principle III mandate test-first: logic tests
(node) and per-component tests (Vitest Browser Mode). Test tasks below must be
written FIRST and FAIL before the implementation they cover.

**Organization**: Tasks are grouped by user story so each story is
independently implementable and testable.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story label (US1..US5) from spec.md
- Exact file paths included in every description

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and dependency check

- [X] T001 [P] Generate shadcn primitives `dialog radio-group badge table input label` via `npx shadcn add` (preset `radix-lyra`, phosphor icons) → files under `src/components/ui/` (do not replace existing `button`)
- [X] T002 [P] Verify form-validation deps in `package.json` (`zod@^4.4.3`, `react-hook-form@^7.85.0`, `@hookform/resolvers@^5.7.1`) and confirm `npm ls zod` shows a single top-level v4 (deduped with the tooling) with shadcn's `zod@3.25.76` nested and untouched

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story

**Note**: Blocking. No user story work can begin until this phase is complete.

- [X] T003 Create domain types in `src/features/supply-orders/logic/types.ts` per `data-model.md` (`OrderStatus`, `Modality`, `WizardStep`, `SendStatus`, `Role`, `Ingredient`, `Dish`, `SupplierProduct`, `OrderItem`, `SingleOrder`, `OrderGroup`, `HistoryEntry`, `isGroup`; strict, no `!`)
- [X] T004 [P] Create fixtures in `src/features/supply-orders/logic/__fixtures__/index.ts` from `dump/CUS04/src/features/supply-orders/logic/data.ts` (`INGREDIENTS`, `DISHES`, `SUPPLIER_PRODUCTS`, `ORDER_HISTORY`); never imported into production components
- [X] T005 [P] Write logic tests (RED) in `src/features/supply-orders/logic/calculations.test.ts` for `groupBySupplier` (single vs multi supplier, decimals, per-supplier and grand totals) and `formatCurrency` (es-PE, PEN)
- [X] T006 Implement `src/features/supply-orders/logic/calculations.ts` (`groupBySupplier` without non-null assertions; `formatCurrency` via `Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' })`) → make T005 green
- [X] T007 [P] Write logic tests (RED) in `src/features/supply-orders/logic/role.test.ts` for `getCurrentRole` and `requireAdmin` (admin passes, non-admin throws/redirect)
- [X] T008 Implement `src/features/supply-orders/logic/role.ts` (stub role constant/config, `getCurrentRole(): Role`, `requireAdmin()` throwing on non-admin; swap target for the future auth module)
- [X] T009 [P] Write logic tests (RED) in `src/features/supply-orders/logic/api/mock.test.ts`: `calculateDishItems` (aggregation `cantidad × proporción`, 1-decimal rounding, skip zero), `calculateShortageItems` (filter `currentStock < desiredStock`, `qty = desired - current`), libre builder, `emitOrders` (deterministic per-supplier `sendStatus`, always registered), catalog/history/kpis accessors
- [X] T010 Create `src/features/supply-orders/logic/api/dtos.ts` (raw DTO types per `contracts/api.md`; snake_case-ready, used as the swap target)
- [X] T011 Create `src/features/supply-orders/logic/api/client.ts` (`ApiError { status, message }` normalization on top of `src/lib/http` `request`; optional `VITE_API_BASE_URL`)
- [X] T012 Implement `src/features/supply-orders/logic/api/mock.ts` (backend simulation with swap-1:1 signatures per `contracts/api.md`; uses `logic/__fixtures__/`) → make T009 green
- [X] T013 [P] Write logic tests (RED) in `src/features/supply-orders/logic/api/mappers.test.ts` for `fromXxxDto` + type guards (valid payloads map; invalid → `ApiError`, never raw)
- [X] T014 Implement `src/features/supply-orders/logic/api/mappers.ts` (`fromXxxDto` + hand-written type guards; validation failure → error state) → make T013 green
- [X] T015 Create `src/features/supply-orders/logic/api/hooks.ts` (TanStack Query: `useSupplyOrders`, `useKpis`, `useCatalog`, `useCalculateItems` mutation, `useEmitOrders` mutation; namespaced query keys; loading/error/empty per FR-008; invalidates history after emit)

**Checkpoint**: Foundation ready — user story implementation can begin.

---

## Phase 3: User Story 1 - Administrador revisa el historial de órdenes (Priority: P1) - MVP

**Goal**: KPIs + expandable order history + filters inside a lazy route.

**Independent Test**: Render `/abastecimiento`, verify KPIs, table with single
and group rows, expand/collapse a group by keyboard and mouse, filter by
status and search, empty state, loading/error states.

### Tests for User Story 1 (write FIRST, must FAIL) 

- [X] T016 [P] [US1] Component test (RED) `src/features/supply-orders/components/status-badge.test.tsx` (each `OrderStatus` → expected token classes; text + color, never color alone)
- [X] T017 [P] [US1] Component test (RED) `src/features/supply-orders/components/kpi-card.test.tsx` (icon, label, formatted value, sub, `warn` variant)
- [X] T018 [P] [US1] Component test (RED) `src/features/supply-orders/components/orders-table.test.tsx` (single rows, group expand/collapse via keyboard with `aria-expanded`, empty message)
- [X] T019 [P] [US1] Component test (RED) `src/features/supply-orders/components/order-filters.test.tsx` (status pills, search input, callback wiring)
- [X] T020 [P] [US1] Component test (RED) `src/features/supply-orders/components/supply-orders-page.test.tsx` (KPIs + table + filters rendered from hooks; loading/error/empty; wizard trigger present)

### Implementation for User Story 1

- [X] T021 [P] [US1] Implement `src/features/supply-orders/components/status-badge.tsx` per `contracts/components.md` status→token mapping
- [X] T022 [P] [US1] Implement `src/features/supply-orders/components/kpi-card.tsx` per `contracts/components.md` (Phosphor icon, semantic tokens)
- [X] T023 [P] [US1] Implement `src/features/supply-orders/components/orders-table.tsx` (shadcn `Table`, keyboard-operable expand control, `StatusBadge`, `font-mono` numeric cells)
- [X] T024 [P] [US1] Implement `src/features/supply-orders/components/order-filters.tsx` (status pills + search input, empty-state propagation)
- [X] T025 [US1] Implement `src/features/supply-orders/components/supply-orders-page.tsx` (wire hooks, compose KPIs/filters/table, wizard trigger button)
- [X] T026 [US1] Create lazy file route `src/routes/abastecimiento.tsx` (`createFileRoute('/abastecimiento')`, renders `SupplyOrdersPage` inside the existing root shell)

**Checkpoint**: US1 fully functional and testable independently.

---

## Phase 4: User Story 2 - Administrador emite órdenes por abasto libre (Priority: P1) - MVP

**Goal**: Full 5-step wizard (modality → configure → assign → summary → done)
for abasto libre, with zod/react-hook-form validation and mock emission.

**Independent Test**: Open the wizard, complete the 5 steps by abasto libre,
verify grouping by supplier, totals (es-PE), confirm → done step with
per-supplier send status; history updates after close.

### Tests for User Story 2 (write FIRST, must FAIL)

- [X] T027 [P] [US2] Component tests (RED) `src/features/supply-orders/components/wizard-modal.test.tsx` + `wizard-progress.test.tsx` (Radix Dialog open/close, focus trap, step indicator 1..4)
- [X] T028 [P] [US2] Logic tests (RED) for form schemas in `src/features/supply-orders/components/step-modality.form.test.ts`, `step-configure.form.test.ts`, `step-assign.form.test.ts` (valid/invalid transitions that enable/disable `Continuar`)
- [X] T029 [P] [US2] Component test (RED) `step-modality.test.tsx` (three modalities, selection calls `onSelect`)
- [X] T030 [P] [US2] Component test (RED) `step-configure.test.tsx` (libre quantities, `Continuar` disabled until ≥ 1 quantity > 0, calls `useCalculateItems`)
- [X] T031 [P] [US2] Component test (RED) `step-assign.test.tsx` (Radix RadioGroup per ingredient, `Continuar` disabled until all assigned)
- [X] T032 [P] [US2] Component test (RED) `step-summary.test.tsx` (grouped by supplier, per-supplier subtotal, grand total es-PE)
- [X] T033 [P] [US2] Component test (RED) `step-done.test.tsx` (order count, supplier names, per-supplier `sendStatus`)

### Implementation for User Story 2

- [X] T034 [P] [US2] Implement `src/features/supply-orders/components/wizard-progress.tsx`
- [X] T035 [P] [US2] Implement `src/features/supply-orders/components/step-modality.form.ts` + `step-modality.tsx` (`useForm` + zod schema, `zodResolver`)
- [X] T036 [P] [US2] Implement `src/features/supply-orders/components/step-configure.form.ts` + `step-configure.tsx` (libre branch; `useCalculateItems`; passes `OrderItem[]` to `onNext`)
- [X] T037 [P] [US2] Implement `src/features/supply-orders/components/step-assign.form.ts` + `step-assign.tsx` (Radix RadioGroup per ingredient)
- [X] T038 [P] [US2] Implement `src/features/supply-orders/components/step-summary.tsx` (`groupBySupplier`, totals, `font-mono`)
- [X] T039 [P] [US2] Implement `src/features/supply-orders/components/step-done.tsx` (order + send-status display)
- [X] T040 [US2] Implement `src/features/supply-orders/components/wizard-modal.tsx` (Radix Dialog, wizard state machine, Atrás/Continuar with per-step validation gates, closing discards selection)
- [X] T041 [US2] Wire `useEmitOrders` into the confirm flow in `wizard-modal.tsx`; invalidate `useSupplyOrders` so history reflects the new orders after close

**Checkpoint**: US2 works independently.

---

## Phase 5: User Story 3 - Administrador emite órdenes por abasto por escasez (Priority: P2)

**Goal**: Escasez modality: backend-calculated shortage quantities and empty
state when nothing is below target stock.

**Independent Test**: Select Por escasez, verify ingredients below desired
stock with calculated `qty = desiredStock - currentStock` (actual/deseado/
solicitar), and the empty state when there is no shortage (Continuar blocked).

### Tests for User Story 3 (write FIRST, must FAIL)

- [X] T042 [P] [US3] Component test (RED) `step-configure.test.tsx` (escasez branch: computed rows, empty state blocks `Continuar`)

### Implementation for User Story 3

- [X] T043 [US3] Implement the escasez branch in `src/features/supply-orders/components/step-configure.form.ts` + `step-configure.tsx` (`useCalculateItems` escasez, empty-state UI, gated `Continuar`)

**Checkpoint**: US3 works; US1/US2 unaffected.

---

## Phase 6: User Story 4 - Administrador emite órdenes por abasto por platillos (Priority: P2)

**Goal**: Platillos modality: dish quantities aggregated by recipe into order
items.

**Independent Test**: Select Por platillos, set quantities, verify items
aggregate `cantidad × proporción` per ingredient, and that with no quantity
`Continuar` is blocked.

### Tests for User Story 4 (write FIRST, must FAIL)

- [X] T044 [P] [US4] Component test (RED) `step-configure.test.tsx` (platillos branch: dish rows, aggregated items, empty blocks `Continuar`)

### Implementation for User Story 4

- [X] T045 [US4] Implement the platillos branch in `src/features/supply-orders/components/step-configure.form.ts` + `step-configure.tsx` (`useCalculateItems` platillos)

**Checkpoint**: US4 works; all stories independently functional.

---

## Phase 7: User Story 5 - Módulo accesible, tipado y protegido por rol (Priority: P3)

**Goal**: Route guard (role stub), WCAG 2.1 AA, strict typing/lint gates.

**Independent Test**: `getCurrentRole() = 'staff'` redirects `/abastecimiento`
to `/`; `'admin'` renders. Keyboard/focus/labels verified; lint + typecheck +
tests + build green with no `any`/`!`/`console.log`.

### Tests for User Story 5 (write FIRST, must FAIL)

- [x] T046 [P] [US5] Route guard test (RED) in `src/routes/abastecimiento.test.tsx` (non-admin redirected to `/`, admin renders `SupplyOrdersPage`)

### Implementation for User Story 5

- [x] T047 [US5] Add `beforeLoad` guard to `src/routes/abastecimiento.tsx` using `requireAdmin` from `logic/role.ts` (redirect non-admin to `/`) → make T046 green
- [x] T048 [P] [US5] a11y audit across the wizard and table: keyboard operability, visible focus, labels/`aria-describedby` on form controls, badges convey state with text + color (WCAG 2.1 AA)
- [x] T049 [P] [US5] Code audit across `src/features/supply-orders/` and `src/routes/abastecimiento.tsx`: no `any`, no `!`, no `console.log`, no hardcoded palette colors, no emoji icons (Phosphor only); `npm run lint`, `typecheck`, `test`, `test:components`, `build` green (SC-004)

**Checkpoint**: All user stories complete and independently verifiable.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: End-to-end validation and documentation consistency

- [x] T050 [P] Run every scenario in `quickstart.md` end-to-end and fix gaps
- [x] T051 [P] Review `contracts/components.md`, `contracts/api.md`, `spec.md`, `data-model.md` for drift vs the implementation; amend with a clarification session if needed
- [x] T052 [P] Full gate run: `npm run lint`, `npm run typecheck`, `npm run test`, `npm run test:components`, `npm run build` — all green

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS all user stories
- **User Stories (Phase 3+)**:
  - **US1 (Phase 3)**: Foundational only — MVP
  - **US2 (Phase 4)**: Foundational only (shares `StepConfigure`/`StepAssign` primitives with US3/US4); reuses US1 page trigger — MVP
  - **US3 (Phase 5)**: Depends on US2 wizard + `StepConfigure`
  - **US4 (Phase 6)**: Depends on US2 wizard + `StepConfigure`
  - **US5 (Phase 7)**: Route exists (US1) + role stub (Foundational)
- **Polish (Phase 8)**: All desired user stories complete

### Within Each User Story

Tests MUST be written and FAIL before implementation → models/types before
services → services before UI wiring → story complete before next priority.

### Parallel Opportunities

- Phase 1 and all Foundational `[P]` tasks can run in parallel
- All `[P]` test tasks within a story run in parallel (separate files)
- All `[P]` implementation tasks within a story run in parallel (separate files)
- US3 and US4 both extend `StepConfigure` — do NOT run those two story
  branches concurrently on the same files; run sequentially after US2

---

## Parallel Example: User Story 1

```bash
Task: "Component test (RED) for status-badge, kpi-card, orders-table, order-filters, supply-orders-page"
# all in src/features/supply-orders/components/*.test.tsx
Task: "Implementation for status-badge, kpi-card, orders-table, order-filters (parallel), then supply-orders-page + route"
```

---

## Implementation Strategy

### MVP First (US1 + US2 — both P1)

1. Phase 1: Setup (shadcn primitives, deps verified)
2. Phase 2: Foundational (types, fixtures, calculations, role, api/mock, mappers, hooks)
3. Phase 3: US1 (historial + KPIs) → STOP and VALIDATE independently
4. Phase 4: US2 (wizard abasto libre) → STOP and VALIDATE — **MVP**
5. Phase 5–7: US3, US4, US5 in order
6. Phase 8: Polish + full gates

### Incremental Delivery

Each story adds value without breaking previous stories; commit after each
task or logical group (Conventional Commits).

---

## Notes

- `[P]` = different files, no dependencies
- `[Story]` label maps each task to its spec.md user story
- Verify tests fail before implementing (RED → GREEN)
- US3/US4 edit the same `step-configure.*` files — sequence them (US3 then US4)
- Do not introduce new dependencies beyond those approved (zod, react-hook-form, @hookform/resolvers, shadcn primitives)
