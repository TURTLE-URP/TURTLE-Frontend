# Implementation Plan: Gestionar Proveedores

**Branch**: `002-gestionar-proveedores` | **Date**: 2026-09-11 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-gestionar-proveedores/spec.md` (ECUS04 "Gestionar Proveedores", v1.1) + prototipos Figma.

## Summary

Build the "Gestionar Proveedores" admin module as a feature slice inside the
existing TURTLE SPA: a paginated, searchable list of suppliers (columns
Proveedor, RUC, Contacto, Ciudad, Registrado, Estado, Acciones) with
register/edit modals, fiscal-data autocomplete by RUC/NIT, and confirm-based
deactivation/reactivation flows, all restricted to Admin users.

Per the clarified Q1=B, the backend is not ready: we define the HTTP contract
first (`contracts/proveedores-api.md`) and implement a repository port backed by
an in-memory mock (`contracts/proveedores-repository.md`) so the UI is fully
exercisable today; the real fetch adapter is a drop-in later. Required behaviors
use only the mandated stack: Tailwind/Radix/shadcn primitives, TanStack Query
for server-state, native `fetch`, Zustand for toast state. No new runtime
dependencies (validation and toasts are hand-rolled per the dependency rule).

## Technical Context

**Language/Version**: TypeScript (strict mode), React 19, Node.js 24 (Active LTS — `.nvmrc`)

**Primary Dependencies**: The approved stack only — TanStack Query v5 (list
state + fiscal lookup), TanStack Router (file-based route `/proveedores`),
Zustand v5 (toast store), native `fetch` wrapper `src/lib/http` (future HTTP
adapter only; the mock satisfies the same port), Tailwind v4 + shadcn/ui with
`cn` (`@/lib/utils`). New shadcn primitives to add via the approved flow:
`table`, `dialog`, `input`, `label`, `badge`, `select`. Icons: `@phosphor-icons/react`.

**Authentication/Role Gating**: **NEEDS CLARIFICATION** → resolved in
`research.md` (FR-013). No auth mechanism exists in the scaffold; the feature
ships a mock session (assumed Admin) behind a route guard, with real auth
deferred.

**Storage**: N/A (SPA). Supplier data for this feature comes from an in-memory
mock repository seeded with ~25 suppliers (realistic pagination); no
persistence beyond the TanStack Query cache for the session.

**Testing**: Vitest in `node` environment for logic tests (validation, filters,
format, repository port, query helpers); Vitest Browser Mode (Playwright
provider, Chromium) for component tests (every component ships `.test.tsx`).

**Target Platform**: Modern evergreen browsers (ES2022+); served by Nginx in a
Docker container (existing deployment).

**Project Type**: Frontend SPA (web application) — feature slice.

**Performance Goals**: Maintain Core Web Vitals budget (LCP < 2.5s on 3G);
list/búsqueda/paginación respond in <2s under normal network (SC-002); debounce
search (300ms) so the table does not refetch per keystroke; `placeholderData:
keepPreviousData` so page changes do not flash the spinner (TanStack Query v5).

**Constraints**: WCAG 2.1 AA (Radix dialogs, labels, focus, keyboard); RUC/NIT
11 digits; soft-delete only (never physical deletion, SC-004); loading/error/
empty states mandatory (FR-011); no new dependency without consultation; contract-first
mock (FR-014).

**Scale/Scope**: One admin module; ~25 mock records; page size 10 (default).
Real backend integration and real auth are follow-up features, not this one.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Section | Gate | Status |
|---------|------|--------|
| Principle I (SPA Vite+React, small components, shared state in Zustand, code splitting) | Feature slice decomposed into small components; toast state in Zustand; route lazy-loaded | PASS |
| Principle II (TS strict, ESLint+Prettier, no `any`/dead code/`console.log`) | Strict typing, lint/format gates, JSDoc'd prop interfaces | PASS |
| Principle III (test-first: logic tests in `node` + component tests in Browser Mode, per component) | Every logic module ships `.test.ts`; every component ships `.test.tsx`; validation and flows covered | PASS |
| Principle IV (no secrets, env via `VITE_`, no unsafe HTML) | No new env vars; no `dangerouslySetInnerHTML`; mock lives in source only | PASS |
| Principle V (zero-error build, code splitting, loading/empty/error states, error boundaries) | FR-011 states explicit; build script; existing error boundary wraps layout | PASS |
| Principle VI (WCAG 2.1 AA; Radix for dialogs; labels; focus) | Radix Dialog for modals/confirms; labelled inputs; keyboard operability | PASS |
| Principle VII (SonarQube gate) | Deferred as in 001 (external infra) | PASS (deferred) |
| Technology Stack (Tailwind, Radix, TanStack Q/R, Zustand, fetch) | Approved stack only; new primitives via `npx shadcn add` (approved flow); no extra HTTP client | PASS |
| Dependency rules (LTS/compatible/`npm audit`; no new dep without consultation) | No new runtime deps: `sonner` (toast), `react-hook-form`/`zod` (validation) considered and deferred/rejected, documented in `research.md` | PASS |
| Security Requirements (audit clean, input validation) | `npm audit` script; RUC/email/phone validated in logic before submit; fiscal data treated as external input | PASS |
| Environment & Configuration (Node 24, `.nvmrc`, `engines`, npm, fail-fast) | Unchanged by this feature; no new env vars | PASS |
| Development Workflow (feature branch; PR into `main` with spec + tests) | Branch `002-...`; PR will reference spec + tests | PASS |
| Documentation (README, props JSDoc, ADRs) | This feature's plan/research/data-model/contracts/quickstart; component props documented | PASS |
| Governance (docs travel with code; ADR for stack changes) | No stack change; deferred deps recorded in research | PASS |

**Result**: No unjustified violations. One clarification (FR-013 auth gating)
resolved in `research.md` without new dependencies; SonarQube gate deferred as
in feature 001.

## Project Structure

### Documentation (this feature)

```text
specs/002-gestionar-proveedores/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   ├── proveedores-api.md        # Phase 1 output — HTTP contract (contract-first, FR-014)
│   └── proveedores-repository.md # Phase 1 output — data access port + mock
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── error-boundary.tsx         # exists
│   ├── providers.tsx              # exists (QueryClient)
│   └── router.tsx                 # exists
├── components/
│   └── ui/                        # exists; shadcn primitives (add via `npx shadcn add`)
│       ├── button.tsx             # exists
│       ├── badge.tsx              # NEW (shadcn)
│       ├── dialog.tsx             # NEW (shadcn)
│       ├── input.tsx              # NEW (shadcn)
│       ├── label.tsx              # NEW (shadcn)
│       ├── select.tsx             # NEW (shadcn)
│       └── table.tsx              # NEW (shadcn)
├── features/
│   ├── greeting/                  # exists (reference pattern)
│   │   ├── components/greeting-card.tsx (+test)
│   │   └── logic/build-greeting.ts (+test)
│   └── proveedores/               # NEW feature slice
│       ├── components/
│       │   ├── proveedores-table.tsx        (+test)
│       │   ├── proveedores-filters.tsx      (+test)  # búsqueda + paginación
│       │   ├── proveedor-form-dialog.tsx    (+test)  # registro y edición
│       │   ├── proveedor-confirm-dialog.tsx (+test)  # desactivar/reactivar (Radix)
│       │   ├── estado-badge.tsx             (+test)
│       │   ├── proveedores-states.tsx       (+test)  # loading/error/empty (FR-011)
│       │   └── toast.tsx                    (+test)  # notificaciones (FR-012)
│       ├── logic/
│       │   ├── validation.ts                (+test)  # RUC 11 díg, email, teléfono
│       │   ├── filters.ts                   (+test)  # criterios de búsqueda + página
│       │   └── format.ts                    (+test)  # fecha registro / texto
│       ├── data/
│       │   ├── proveedores-repository.ts    (+test)  # port (interfaz) — contracts/repository
│       │   ├── mock-proveedores-repository.ts (+test) # in-memory mock, ~25 seed
│       │   └── proveedores-query.ts         (+test)  # hooks TanStack Query + debounce
│       └── index.ts                         # re-exports públicos del feature
├── lib/
│   ├── env/env.ts (+test)        # exists
│   ├── http/http.ts (+test)      # exists — usado por el futuro adapter HTTP
│   └── utils.ts                  # exists (cn)
├── routes/
│   ├── __root.tsx                # exists (+ nav link "Proveedores" guardado)
│   ├── index.tsx                 # exists
│   └── proveedores.tsx           # NEW — ruta file-based lazy, guard admin
├── stores/
│   ├── app-store.ts (+test)      # exists
│   └── toast-store.ts (+test)    # NEW — cola de notificaciones (Zustand)
└── styles/index.css              # exists
```

**Structure Decision**: Feature-first SPA layout (Option 1, consistent with
001). The feature slice `src/features/proveedores/` mirrors the established
`features/<name>/{components,logic}` pattern and adds a `data/` folder holding
the repository port, its mock implementation, and the TanStack Query hooks —
the seam required by FR-014 (contract-first, mock today / HTTP later). UI
primitives are added through the shadcn flow (tokens + CVA + `cn` consistent).
Tests are co-located next to the code they cover (`.test.ts` logic, `.test.tsx`
component), satisfying Principle III.

## Complexity Tracking

No constitution violations requiring justification — table intentionally empty.
The `data/` port exists to satisfy FR-014 (mock-first, swap-in HTTP later); it
is the simplest seam that makes that requirement testable without a backend.