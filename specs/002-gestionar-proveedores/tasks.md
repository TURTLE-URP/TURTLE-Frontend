# Tasks: Gestionar Proveedores

**Input**: Design documents from `/specs/002-gestionar-proveedores/`

**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Tests**: THIS FEATURE INCLUDES TESTS — they are mandatory because the
Constitution Principle III (Test-First, NON-NEGOTIABLE) requires logic tests
(Vitest `node`) and per-component tests (Vitest Browser Mode). Follow
red-green-refactor: write each test first, confirm it FAILS, then implement.

**Organization**: Tasks are grouped by user story so each story can be
implemented, tested, and delivered independently (MVP first = User Story 1).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1..US5)
- Exact file paths in every description (project root = `src/`)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Add the approved UI primitives and create the feature slice skeleton.

- [X] T001 Add shadcn/ui primitives via `npx shadcn add badge dialog input label select table` so src/components/ui/{badge,dialog,input,label,select,table}.tsx exist (Radix-based, CVA + `cn`, theme tokens per ADR-0001)
- [X] T002 [P] Create feature skeleton directories src/features/proveedores/{components,logic,data} and the public barrel src/features/proveedores/index.ts (re-exports to be filled in as modules land)

**Checkpoint**: Primitives and skeleton exist; nothing user-visible yet.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared foundation ALL stories depend on: types, repository port +
mock, toast infrastructure, query hooks, route + admin guard (FR-013, FR-014).

**⚠️ CRITICAL**: No user story can begin until this phase is complete.

### Tests (red first)

- [ ] T003 [P] Write logic test for toast store in src/stores/toast-store.test.ts (queue, success/error tones, prune, FR-012)
- [ ] T004 Write logic tests for the mock repository in src/features/proveedores/data/mock-proveedores-repository.test.ts (pagination size 10 + envelope, partial search over nombreComercial/ruc/contacto, RUC uniqueness throw on crear/actualizar, fiscal miss throws for unknown RUC, Activo↔Inactivo transitions)

### Implementation

- [ ] T005 Create shared types in src/features/proveedores/data/types.ts per data-model.md: Proveedor, ProveedorInput, DatosFiscales, FiltrosProveedores, ListadoProveedores
- [ ] T006 Define the ProveedoresRepository port + `RucDuplicadoError` + `createProveedoresRepository()` factory in src/features/proveedores/data/proveedores-repository.ts per contracts/proveedores-repository.md (factory: `VITE_API_BASE_URL` set → HTTP adapter placeholder / else mock)
- [ ] T007 [P] Implement the Zustand toast store in src/stores/toast-store.ts matching T003
- [ ] T008 Implement the in-memory mock in src/features/proveedores/data/mock-proveedores-repository.ts implementing the port (seed ~25 realistas con mix Activo/Inactivo, latency 300–700 ms, soft-delete seule, cantina fiscal para RUCs del seed) matching T004
- [ ] T009 [P] Implement query hooks in src/features/proveedores/data/proveedores-query.ts: `useProveedoresList` (queryKey `['proveedores', { texto, pagina }]`, `placeholderData: keepPreviousData`, debounce 300 ms), `useDatosFiscales(ruc)`, `useCrearProveedor`, `useActualizarProveedor`, `useCambiarEstado` (invalidate `['proveedores']` on success)
- [ ] T010 [P] Implement the toast component in src/features/proveedores/components/toast.tsx with its component test src/features/proveedores/components/toast.test.tsx (renders queue, ARIA live region)
- [ ] T011 Create the admin route guard + mock session and the lazy route in src/routes/proveedores.tsx (file-based TanStack Router; `beforeLoad` guard assuming Admin per research.md FR-013; placeholder page for now), and add a guarded "Proveedores" nav link in src/routes/__root.tsx

**Checkpoint**: Foundation ready — repository port+mock, toasts, hooks, route+guard. Stories can now start (parallelizable).

---

## Phase 3: User Story 1 - Ver listado paginado con búsqueda (P1) 🎯 MVP

**Goal**: The module renders a paginated table (10/page) with columns Proveedor,
RUC, Contacto, Ciudad, Registrado, Estado, Acciones; search filters by
name/RUC/contact; explicit loading/error/empty states (FR-001, FR-002, FR-003,
FR-011).

**Independent Test**: Abrir `/proveedores` → tabla con 10 filas página 1;
buscar "andina" filtra; ir a página 2 muestra el siguiente subconjunto sin
destello de carga; lista vacía y fallo de carga muestran estados diseñados.

### Tests for User Story 1 (red first) ⚠️

- [ ] T012 [P] [US1] Write logic test for src/features/proveedores/logic/format.test.ts (formato de `fechaRegistro`, texto de estado)
- [ ] T013 [P] [US1] Write logic test for src/features/proveedores/logic/filters.test.ts (construcción de FiltrosProveedores, transición dinámica de página, clamp)
- [ ] T014 [P] [US1] Write component test for src/features/proveedores/components/estado-badge.test.tsx (renderiza Activo/Inactivo con tokens del tema)
- [ ] T015 [P] [US1] Write component test for src/features/proveedores/components/proveedores-table.test.tsx (columnas FR-001, filas, badge + acciones por fila)
- [ ] T016 [P] [US1] Write component test for src/features/proveedores/components/proveedores-filters.test.tsx (input de búsqueda debounced, controles página anterior/siguiente)
- [ ] T017 [P] [US1] Write component test for src/features/proveedores/components/proveedores-states.test.tsx (loading skeleton aria-busy, error con "Reintentar", vacío con CTA y sin-resultados)

### Implementation for User Story 1

- [ ] T018 [US1] Implement src/features/proveedores/logic/format.ts matching T012
- [ ] T019 [US1] Implement src/features/proveedores/logic/filters.ts matching T013
- [ ] T020 [P] [US1] Implement src/features/proveedores/components/estado-badge.tsx (themed badge, Activo/Inactivo)
- [ ] T021 [P] [US1] Implement src/features/proveedores/components/proveedores-states.tsx (Loading/Error/Empty components matching FR-011)
- [ ] T022 [P] [US1] Implement src/features/proveedores/components/proveedores-table.tsx (shadcn table, semantic `<caption>`/`<th scope>`, actions column)
- [ ] T023 [US1] Implement src/features/proveedores/components/proveedores-filters.tsx (search input + pagination controls wired to `useProveedoresList`)
- [ ] T024 [US1] Replace the route placeholder: render the full US-1 page in src/routes/proveedores.tsx using `useProveedoresList`, `proveedores-states`, `proveedores-table`, `proveedores-filters`
- [ ] T025 [US1] Write mount/integration component test in src/routes/proveedores.test.tsx (list loads from mock → 10 rows page 1; search filters; page change updates rows)

**Checkpoint**: US-1 fully functional y testeable sola — este es el **MVP**.

---

## Phase 4: User Story 2 - Registrar nuevo proveedor (P1)

**Goal**: "Nuevo Proveedor" opens a modal (Identificación/Contacto/Ubicación);
RUC 11 dígitos autocompleta datos fiscales (FR-005); validations block with
resaltado (FR-006); RUC duplicado alerta bloqueante (FR-007); on save → row
Activo + toast (FR-012). Fiscal failure blocks with "Reintentar" (Q3=B).

**Independent Test**: Modal → RUC de seed autocompleta razón social/nombre/
dirección → guardar añade fila Activo + notificación; RUC inválido/email/
teléfono erróneos bloquean con mensajes; RUC existente da alerta de duplicado;
RUC no-seed bloquea el avance con error + reintentar.

### Tests for User Story 2 (red first) ⚠️

- [ ] T026 [P] [US2] Write logic test for src/features/proveedores/logic/validation.test.ts (RUC de 11 dígitos, email válido, teléfono válido, mapa de errores por campo)
- [ ] T027 [P] [US2] Write component test for src/features/proveedores/components/proveedor-form-dialog.test.tsx (register mode: autocompletado fiscal, errores de validación resaltados, alerta de duplicado, error fiscal con "Reintentar" que bloquea el envío)

### Implementation for User Story 2

- [ ] T028 [US2] Implement src/features/proveedores/logic/validation.ts matching T026
- [ ] T029 [US2] Implement src/features/proveedores/components/proveedor-form-dialog.tsx (Radix Dialog; secciones del formulario; `useDatosFiscales` autocompleta al llegar a 11 dígitos; modo registro; submit → `useCrearProveedor`; feedback de errores accesible; notificación tras éxito)
- [ ] T030 [US2] Wire the "Nuevo Proveedor" action into the US-1 page (proveedores-table/filters) and ensure success/failure toasts fire (FR-012)

**Checkpoint**: US-1 + US-2 funcionan e interactúan.

---

## Phase 5: User Story 3 - Actualizar datos del proveedor (P1)

**Goal**: "Editar" opens the same dialog prefilled; save updates the row with
the same validations and duplicate-RUC check (FR-008); toast + refresh (FR-012).

**Independent Test**: Editar teléfono de un proveedor → guardar → fila
actualizada + notificación; RUC duplicado bloquea; RUC propio no cuenta como
duplicado.

### Tests for User Story 3 (red first) ⚠️

- [ ] T031 [P] [US3] Extend src/features/proveedores/components/proveedor-form-dialog.test.tsx for edit mode (prefill con datos actuales, guarda cambios, RUC propio no duplica)

### Implementation for User Story 3

- [ ] T032 [US3] Add edit mode to src/features/proveedores/components/proveedor-form-dialog.tsx (acepta proveedor actual; submit → `useActualizarProveedor`; los datos originales se cargan al abrir)
- [ ] T033 [US3] Wire the "Editar" action in proveedores-table rows + success toast + list refresh

**Checkpoint**: CRUD completo sobre un proveedor.

---

## Phase 6: User Story 4 - Desactivar proveedor con confirmación (P2)

**Goal**: "Desactivar" solicita confirmación explícita; al confirmar el estado
pasa a Inactivo conservando el registro (soft-delete, FR-009/FR-010, SC-004);
cancelar no cambia nada; toast + refresh (FR-012).

**Independent Test**: Desactivar un proveedor Activo → buscar → confirmar →
estado Inactivo + notificación; cancelar → sin cambios (registro visible).

### Tests for User Story 4 (red first) ⚠️

- [ ] T034 [P] [US4] Write component test for src/features/proveedores/components/proveedor-confirm-dialog.test.tsx (diálogo abierto sólo tras acción, confirm/cancel sólo disparan su handler, foco y Esc funcionan, copy configurable)

### Implementation for User Story 4

- [ ] T035 [US4] Implement src/features/proveedores/components/proveedor-confirm-dialog.tsx (Radix Dialog reutilizable: título/descripción/acciones configurables; botones de confirmación y cancelación)
- [ ] T036 [US4] Wire "Desactivar" en proveedores-table → proveedor-confirm-dialog → `useCambiarEstado('Inactivo')` → toast + refresh list

**Checkpoint**: Estados de proveedores modificables de forma segura.

---

## Phase 7: User Story 5 - Reactivar proveedor inactivo (P2)

**Goal**: Sobre una fila Inactiva, el diálogo "Activar proveedor" con copy de
Figma ("¿Deseas reactivar a {nombre}? Volverá a estar disponible en el sistema.",
botones "Cancelar" y "Sí, activar"); al confirmar → Activo + toast (FR-015, Q2=A).

**Independent Test**: Reactivar un Inactivo → "Sí, activar" → estado Activo +
notificación; "Cancelar" → sin cambios.

### Tests for User Story 5 (red first) ⚠️

- [ ] T037 [P] [US5] Extend src/features/proveedores/components/proveedor-confirm-dialog.test.tsx to cover the reactivation copy (botón "Sí, activar", texto con el nombre del proveedor)

### Implementation for User Story 5

- [ ] T038 [US5] Wire reactivation flow: "Reactivar" en filas Inactivo de proveedores-table → proveedor-confirm-dialog con copy de Figma → `useCambiarEstado('Activo')` → toast + refresh

**Checkpoint**: Todas las user stories implementadas.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Shave edges shared by all stories; prove the module end-to-end.

- [ ] T039 [P] Run the 14 quickstart scenarios end-to-end (specs/002-gestionar-proveedores/quickstart.md) against the mock and fix every discrepancy found
- [ ] T040 [P] Update README.md: módulo Proveedores, ruta `/proveedores`, contrato mock-first y swap del adapter (FR-014) — documentation travels with code
- [ ] T041 Run full quality gates: `npm run lint`, `npm run typecheck`, `npm test`, `npm run test:components`, `npm run build`, `npm run audit` — all must exit 0
- [ ] T042 [P] Final review sweep: RUC duplicado mapping error-toast, a11y (labels, focus, contraste AA, solo-color no informa), sin `console.log`/código muerto, port/HOOK seams clean
- [ ] T043 Commit every logical group with Conventional Commits (`feat:`, `test:`, `docs:`) on branch `002-gestionar-proveedores` and open the PR into `main` referencing spec + tests (constitution hybrid merge policy)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS all user stories
- **US1 (Phase 3)**: Depends on Foundational — MVP, no story deps
- **US2 (Phase 4)**: Depends on Foundational — builds the form dialog US-3 reuses
- **US3 (Phase 5)**: Depends on US2 (reuses `proveedor-form-dialog`) + Foundational
- **US4 (Phase 6)**: Depends on Foundational (`useCambiarEstado`) — no story deps
- **US5 (Phase 7)**: Depends on US4 (`proveedor-confirm-dialog`) + Foundational
- **Polish (Phase 8)**: Depends on all desired stories complete

### User Story Dependencies

- **US1 (P1)**: none → MVP
- **US2 (P1)**: none → parallelizable with US1
- **US3 (P1)**: reuses US2 dialog — can share the same session after US2
- **US4 (P2)**, **US5 (P2)**: independent of US1–US3 except the shared table/rows

### Parallel Opportunities

- T001/T002 (Setup) run in parallel (different concerns; note `npx shadcn add` first)
- Foundational: T003+T007 (toast), T004+T008 (mock), T009 (hooks), T010 (toast UI), T011 (route) — all on different files
- Multi-developer: after Foundational, **A** can take US1, **B** US2, **C** US4 (US3 waits on US2's dialog; US5 waits on US4's dialog)
- Tests within each story are `[P]` (all on different files)
- Polish tasks `[P]` — independent files

### Within Each User Story

- Tests written first, MUST FAIL → implement → test green (red-green-refactor)
- Logic (`logic/`) antes de UI; port/tipos antes de componentes
- Story complete before moving to next priority

---

## Parallel Example: User Story 1

```bash
# Tests first (all different files):
Task: "Logic test for src/features/proveedores/logic/format.test.ts"
Task: "Logic test for src/features/proveedores/logic/filters.test.ts"
Task: "Component test for src/features/proveedores/components/estado-badge.test.tsx"
Task: "Component test for src/features/proveedores/components/proveedores-table.test.tsx"

# Implementations (all different files):
Task: "src/features/proveedores/logic/format.ts"
Task: "src/features/proveedores/logic/filters.ts"
Task: "src/features/proveedores/components/estado-badge.tsx"
Task: "src/features/proveedores/components/proveedores-table.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1 Setup → 2. Phase 2 Foundational → 3. Phase 3 US-1 → **STOP & VALIDATE**
4. Demo/commit US-1 sola (listado paginado + búsqueda + estados)

### Incremental Delivery

1. Setup + Foundational → foundation ready
2. **+ US1** → test → demo (MVP)
3. **+ US2** → test → demo (registro)
4. **+ US3** → test → demo (edición)
5. **+ US4** → test → demo (desactivación)
6. **+ US5** → test → demo (reactivación)
7. Polish → PR into `main`

### Parallel Team Strategy

1. Team completes Setup + Foundational together
2. Developer A: US1; Developer B: US2; Developer C: US4
3. Then US3 (B, after US2 dialog) and US5 (C, after US4 dialog)
4. Integrate; each story independently testable

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to a user story (traceability to spec.md)
- Tests first, verify they fail, then implement; per-component and per-logic tests are mandatory (Constitution Principle III)
- Commit after each task or logical group (Conventional Commits)
- Stop at any checkpoint to validate a story independently
- RUC is validated client-side AND at the repository (mock uniqueness) — FR-006/FR-007
- Avoid: vague tasks, same-file conflicts, story coupling that breaks independence