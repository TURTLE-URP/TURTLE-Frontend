# Implementation Plan: Emitir Orden de Abastecimiento (CUS04)

**Branch**: `feature/implement-UC04` | **Date**: 2026-08-09 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-uc04-emitir-orden-abastecimiento/spec.md`

## Summary

Implement the supply-orders module (CUS04): a lazy route `/abastecimiento`
inside the existing scaffold shell showing KPIs and an expandable order
history, plus a 5-step Radix Dialog wizard to emit supply orders in three
modalities (por platillos, por escasez, abasto libre). Server state comes from
TanStack Query against a mock API layer designed for a 1:1 swap to the real
backend (backend calculates quantities; notification send is simulated and
deterministic per supplier). Route access is guarded by a role stub. All
styling uses semantic theme tokens; tests are test-first per the constitution
(logic tests in node, per-component tests in Vitest Browser Mode).

## Technical Context

**Language/Version**: TypeScript strict, React 19, Node.js 24 (Active LTS)

**Primary Dependencies**: Vite 8, Tailwind CSS v4 + shadcn/ui (preset
`radix-lyra`, icon library phosphor), Radix UI via the `radix-ui` umbrella
package, TanStack Query v5, TanStack Router v1 (file-based, Vite plugin code
splitting), Zustand v5 (existing `app-store`), `@phosphor-icons/react`,
Fontsource variable fonts, Vitest 4 + `@vitest/browser` (Playwright,
Chromium), React Testing Library + `user-event`, and the form-validation
stack **zod ^4.4.3 + react-hook-form ^7.85.0 + @hookform/resolvers ^5.7.1**
(direct deps, consulted; zod@4.4.3 dedupes with the tooling's existing copy).
`@/*` alias via `resolve.tsconfigPaths`. Existing fetch wrapper:
`src/lib/http/http.ts` (HttpError, timeout, JSON).

**Storage**: N/A (SPA; server state held by TanStack Query against the mock
API layer; no persistence in this feature).

**Testing**: Vitest in `node` environment for logic tests (`src/**/*.test.ts`);
Vitest Browser Mode (Playwright/Chromium) for component tests
(`src/**/*.test.tsx`, `vitest.setup.ts` + Testing Library). Co-located per
component and per logic module (001 pattern).

**Target Platform**: Modern evergreen browsers (ES2022+); SPA served by Nginx
(Docker) on Linux.

**Project Type**: Frontend SPA (web application)

**Performance Goals**: Route code splitting via lazy file route; lean initial
bundle (no new dependencies expected).

**Constraints**: WCAG 2.1 AA; semantic theme tokens only (no hardcoded palette
values); no `any`, non-null assertions, or `console.log`; no new dependency
without consultation; env fail-fast (`validateEnv`); mock API swap-ready
(contracts/api.md).

**Scale/Scope**: One feature module (`src/features/supply-orders/`) + one lazy
route, within the existing scaffold shell. No backend in this iteration.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Section | Gate | Status |
|---------|------|--------|
| Principle I (SPA, component decomposition, Zustand, code splitting) | Feature as components + `logic/`; shared state only in existing Zustand store; lazy route | PASS |
| Principle II (TS strict, no any/console.log, lint clean) | Strict typing, no `!`/`any`/`console.log` (spec FR-013), ESLint gate | PASS |
| Principle III (logic tests node; component tests Browser Mode; test-first) | Test-first per component + logic module; mock covered by logic tests; Browser Mode mandatory | PASS |
| Principle IV (validate external data; no unsafe HTML) | DTO type guards in `api/mappers.ts`; no `dangerouslySetInnerHTML` | PASS |
| Principle V (build zero errors; loading/empty/error; error boundaries) | Build gate; FR-008 loading/error/empty via TanStack Query | PASS |
| Principle VI (WCAG 2.1 AA; Radix for complex widgets) | Dialog + RadioGroup Radix; keyboard-operable expand rows; badges text+color | PASS |
| Principle VII (SonarQube gate) | No new findings expected; CI gate as in 001 | PASS (no new code paths) |
| Technology Stack (Tailwind, Radix, TanStack Q/R, Zustand, fetch) | All existing deps; no new HTTP client; no new npm deps (shadcn uses `radix-ui`) | PASS |
| Dependency rules (no new dep without consultation) | `shadcn add` primitives dependency-free; form-validation stack (zod + react-hook-form + resolvers) consulted and approved (R7); zod@4 dedupes with tooling | PASS |
| Environment (npm, env fail-fast) | `validateEnv` already in place; `VITE_API_BASE_URL` optional and unused by mock | PASS |

**Result**: No unjustified violations.

## Project Structure

### Documentation (this feature)

```text
specs/002-uc04-emitir-orden-abastecimiento/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   ├── components.md    # component tree, props, tokens, testing
│   └── api.md           # API boundary, DTO↔domain, migration checklist
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── components/ui/                     # shadcn (npx shadcn add dialog radio-group badge table input label)
│   ├── badge.tsx
│   ├── dialog.tsx
│   ├── input.tsx
│   ├── label.tsx
│   ├── radio-group.tsx
│   └── table.tsx
├── routes/
│   └── abastecimiento.tsx             # lazy file route + beforeLoad role guard
└── features/supply-orders/
    ├── components/
    │   ├── kpi-card.tsx
    │   ├── order-filters.tsx
    │   ├── orders-table.tsx
    │   ├── status-badge.tsx
    │   ├── supply-orders-page.tsx
    │   ├── step-assign.tsx
    │   ├── step-configure.tsx
    │   ├── step-done.tsx
    │   ├── step-modality.tsx
    │   ├── step-summary.tsx
    │   ├── wizard-modal.tsx
    │   └── wizard-progress.tsx
    │       # each *.tsx ships a co-located *.test.tsx (Browser Mode)
    ├── logic/
    │   ├── types.ts                    # domain types (data-model.md)
    │   ├── calculations.ts             # groupBySupplier, formatCurrency (client, pure)
    │   ├── role.ts                     # getCurrentRole() stub + requireAdmin()
    │   ├── __fixtures__/               # seed data from the prototype (mock + tests)
    │   └── api/
    │       ├── client.ts               # fetch wrapper usage + ApiError normalization
    │       ├── dtos.ts                 # raw DTO types (swap target for real backend)
    │       ├── mappers.ts              # fromXxxDto + type guards (validation)
    │       ├── mock.ts                 # backend simulation (calculate*/emit) — swap 1:1
    │       └── hooks.ts                # TanStack Query hooks (useSupplyOrders, useKpis,
    │                                   #   useCatalog, useCalculateItems, useEmitOrders)
```

**Structure Decision**: Feature-first SPA layout (001 pattern): the module
lives in `src/features/supply-orders/` with co-located `components/` + `logic/`
+ tests; shared primitives in `src/components/ui/` (shadcn); the route is a
file route under `src/routes/` so TanStack Router code-splits it inside the
existing root shell.

## Complexity Tracking

No constitution violations requiring justification — table intentionally empty.
