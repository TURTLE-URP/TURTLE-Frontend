# Tasks: Ver Cotizaciones

**Input**: Design documents from `/specs/003-ver-cotizaciones/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Included — test-first is NON-NEGOTIABLE per constitution Principle III (Vitest node logic tests + Vitest Browser Mode component tests).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Path Conventions

- SPA single project: `src/` at repository root, feature code in `src/features/cotizaciones/`
- Route: `src/routes/catalogos/cotizaciones.tsx` (exists as placeholder)

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Feature scaffolding and UI primitives

- [X] T001 Create feature directory structure in src/features/cotizaciones/{components,data,logic,pages}
- [X] T002 [P] Add shadcn primitives table, input, label, badge, select, dialog, tooltip via npx shadcn add
- [X] T003 [P] Verify Playwright Chromium is installed for component tests via npx playwright install chromium

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared types, data port + mock, and query hooks that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 [P] Create shared types Cotizacion, FiltrosCotizaciones, ListadoCotizaciones in src/features/cotizaciones/data/types.ts
- [X] T005 [P] Create CotizacionesRepository port in src/features/cotizaciones/data/cotizaciones-repository.ts
- [X] T006 Create in-memory mock with ~25 seeded quotations in src/features/cotizaciones/data/mock-cotizaciones-repository.ts
- [X] T007 [P] Create node logic test for mock filtering/pagination semantics in src/features/cotizaciones/data/mock-cotizaciones-repository.test.ts
- [X] T008 Create TanStack Query list hook in src/features/cotizaciones/data/cotizaciones-query.ts
- [X] T009 [P] Create formatting helpers folio/moneda/fecha in src/features/cotizaciones/logic/format.ts with node test in src/features/cotizaciones/logic/format.test.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Visualizar maestro con búsqueda, filtrado y paginación (Priority: P1) 🎯 MVP

**Goal**: Admin opens `/catalogos/cotizaciones` and sees the paginated quotations table with search, estado + date-range filters, and explicit loading/error/empty/no-results states

**Independent Test**: Open the route with seeded data; table shows 10 rows with columns folio/proveedor/fecha/estado/total/acciones; search, filters, and page navigation work; empty/no-results/error states render per quickstart scenarios 1–4, 10–12

### Tests for User Story 1 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T010 [P] [US1] Node logic test for search/filter/page-reset helpers in src/features/cotizaciones/logic/filters.test.ts
- [X] T011 [P] [US1] Component test for filters UI in src/features/cotizaciones/components/cotizaciones-filters.test.tsx
- [X] T012 [P] [US1] Component test for table rendering in src/features/cotizaciones/components/cotizaciones-table.test.tsx
- [X] T013 [P] [US1] Component test for pagination behavior in src/features/cotizaciones/components/cotizaciones-pagination.test.tsx
- [X] T014 [P] [US1] Component test for loading/error/empty/no-results states in src/features/cotizaciones/components/cotizaciones-states.test.tsx

### Implementation for User Story 1

- [X] T015 [P] [US1] Implement search/filter/page-reset helpers in src/features/cotizaciones/logic/filters.ts
- [X] T016 [P] [US1] Implement states component in src/features/cotizaciones/components/cotizaciones-states.tsx
- [X] T017 [US1] Implement table component in src/features/cotizaciones/components/cotizaciones-table.tsx (depends on T015, T016)
- [X] T018 [P] [US1] Implement filters component with 300ms debounced search in src/features/cotizaciones/components/cotizaciones-filters.tsx
- [X] T019 [P] [US1] Implement pagination component with disabled bordes in src/features/cotizaciones/components/cotizaciones-pagination.tsx
- [X] T020 [US1] Implement page composing table/filters/pagination/states in src/features/cotizaciones/pages/cotizaciones-page.tsx
- [X] T021 [US1] Replace placeholder route with page + admin beforeLoad guard in src/routes/catalogos/cotizaciones.tsx

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Acciones por cotización según estado (Priority: P1)

**Goal**: Each row exposes cerrar / ver Orden de Compra / ver detalles with availability gated by solicitud estado; unavailable actions show disabled-with-reason; derivations open the close modal shell or new tabs

**Independent Test**: Open the route with seeds in all estados; each row shows only its allowed actions; disabled actions show the motivo; close opens the dialog shell; ver OC / ver detalles open new tabs; no creation entry point exists (quickstart scenarios 5–9)

### Tests for User Story 2 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T022 [P] [US2] Node logic test for availability matrix and motivos in src/features/cotizaciones/logic/acciones.test.ts
- [X] T023 [P] [US2] Component test for row actions incl. disabled-with-reason in src/features/cotizaciones/components/row-actions.test.tsx
- [X] T024 [P] [US2] Component test for estado badge in src/features/cotizaciones/components/estado-badge.test.tsx

### Implementation for User Story 2

- [X] T025 [P] [US2] Implement availability matrix in src/features/cotizaciones/logic/acciones.ts
- [X] T026 [P] [US2] Implement estado badge in src/features/cotizaciones/components/estado-badge.tsx
- [X] T027 [US2] Implement row actions with Radix Tooltip motivos, dialog shell trigger, and new-tab links in src/features/cotizaciones/components/row-actions.tsx (depends on T025, T026)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Guarantees that hold across the whole feature

- [X] T028 [P] Component test asserting no creation button/link exists in src/features/cotizaciones/pages/cotizaciones-page.test.tsx
- [X] T029 Run quickstart.md validation scenarios 1–13 against the mock
- [X] T030 Run full quality gates via npm run lint, npm run typecheck, npm test, npm run test:components, npm run build, npm run audit

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (US1 → US2; both P1)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - Renders inside US1's table rows; independently testable via logic matrix + row-actions component tests

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Logic helpers before components
- Components before page/route integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- T004/T005 (types, port) can run in parallel; T007/T009 (tests) in parallel
- All US1/US2 test tasks marked [P] can run in parallel (different files)
- T015/T016/T018/T019 (independent US1 modules) can run in parallel
- T025/T026 (US2 logic + badge) can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Node logic test for search/filter/page-reset helpers in src/features/cotizaciones/logic/filters.test.ts"
Task: "Component test for filters UI in src/features/cotizaciones/components/cotizaciones-filters.test.tsx"
Task: "Component test for table rendering in src/features/cotizaciones/components/cotizaciones-table.test.tsx"
Task: "Component test for pagination behavior in src/features/cotizaciones/components/cotizaciones-pagination.test.tsx"
Task: "Component test for loading/error/empty/no-results states in src/features/cotizaciones/components/cotizaciones-states.test.tsx"

# Launch independent US1 modules together:
Task: "Implement search/filter/page-reset helpers in src/features/cotizaciones/logic/filters.ts"
Task: "Implement states component in src/features/cotizaciones/components/cotizaciones-states.tsx"
Task: "Implement filters component with 300ms debounced search in src/features/cotizaciones/components/cotizaciones-filters.tsx"
Task: "Implement pagination component with disabled bordes in src/features/cotizaciones/components/cotizaciones-pagination.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently (quickstart scenarios 1–4, 10–12)
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- FR-015 (no creation entry point) is enforced by T028 in Polish
- Blocked-popup guidance and session-expiry handling ride along with T020/T021 implementation
