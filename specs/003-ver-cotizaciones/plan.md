# Implementation Plan: Ver Cotizaciones

**Branch**: `003-ver-cotizaciones` | **Date**: 2026-09-27 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/003-ver-cotizaciones/spec.md`

## Summary

Build the read-only "Cotizaciones" master view for the Admin: a paginated table (folio, proveedor, fecha, estado, total/monto, acciones) with free-text search, estado + date-range filters, explicit loading/error/empty/no-results states, and per-row derivations — close-quotation modal trigger (content owned by the follow-up Cerrar Cotización flow), purchase-order detail in a new tab, and quotation detail in a new tab — with actions gated by the linked solicitud estado and disabled-with-reason otherwise. Backend is not ready, so design is contract-first: define the HTTP contract, program against a repository port, and ship an in-memory mock (same pattern as 002-gestionar-proveedores).

## Technical Context

**Language/Version**: TypeScript (strict) + React 19, Vite SPA

**Primary Dependencies**: TanStack Router (routing), TanStack Query v5 (server state), Zustand (shared UI state), Radix UI primitives via `radix-ui` meta-package + shadcn (dialog, table, input, label, badge, select, tooltip), Tailwind CSS v4, native `fetch`

**Storage**: N/A (SPA holds no persistence; in-memory mock repository until the backend lands)

**Testing**: Vitest `logic` project (node env, pure logic) + Vitest `components` project (Browser Mode, real Chromium) — per constitution Principle III

**Target Platform**: Modern evergreen browsers (web SPA served over HTTPS)

**Project Type**: Web application (frontend SPA)

**Performance Goals**: Master list visible in < 2s (FR-012/SC-003); page changes keep previous rows visible (no flicker); search input debounced (~300ms)

**Constraints**: WCAG 2.1 AA (keyboard operable, visible focus, labelled controls, Radix-based dialog/tooltip); explicit loading/empty/error states; no new dependencies without prior consultation; `VITE_`-prefixed env; no global "new quotation" entry point (FR-015)

**Scale/Scope**: Restaurant scale — tens to low hundreds of quotations; page size fixed at 10 (same convention as 002)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | How this plan complies |
|-----------|--------|------------------------|
| I. SPA Architecture (Vite + React, Zustand, code splitting) | ✅ Pass | Feature lives in `src/features/cotizaciones/`; route lazy-loadable; shared filter/page state colocated or in a feature Zustand store; TanStack Query for server state |
| II. TypeScript strict, lint/format clean | ✅ Pass | All new code typed strict, no `any`; ESLint + Prettier gates in CI |
| III. Test-First (Vitest node logic + Browser Mode components) | ✅ Pass | Pure logic (`filters.ts`, `acciones.ts`, `format.ts`) covered in node env; every component gets a Browser Mode test; no merge without passing tests |
| IV. Security by Design | ✅ Pass | Admin-only route guard reusing the mock-session pattern from 002; no secrets; external data validated (zod already in deps); no `dangerouslySetInnerHTML` |
| V. Production Readiness | ✅ Pass | Explicit loading/error/empty/no-results states; error boundary coverage; `npm run build` zero errors |
| VI. Accessibility (WCAG 2.1 AA, Radix) | ✅ Pass | Table/filters/pagination keyboard operable; Radix Dialog + Tooltip for modal and disabled-with-reason explanations; contrast via theme tokens |
| VII. SonarQube gate | ✅ Pass | No new bugs/vulns; coverage ≥ 80% on new code |

No violations — Complexity Tracking stays empty.

## Project Structure

### Documentation (this feature)

```text
specs/003-ver-cotizaciones/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   ├── cotizaciones-api.md
│   └── cotizaciones-repository.md
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── features/cotizaciones/          # NEW (dir exists, empty) — all feature code
│   ├── components/
│   │   ├── cotizaciones-table.tsx
│   │   ├── cotizaciones-filters.tsx
│   │   ├── cotizaciones-pagination.tsx
│   │   ├── cotizaciones-states.tsx
│   │   ├── estado-badge.tsx
│   │   └── row-actions.tsx
│   ├── data/
│   │   ├── types.ts
│   │   ├── cotizaciones-repository.ts      # port
│   │   ├── mock-cotizaciones-repository.ts # mock adapter + seed
│   │   └── cotizaciones-query.ts           # TanStack Query hooks
│   ├── logic/
│   │   ├── filters.ts        # search/filter/pagination pure helpers
│   │   ├── acciones.ts       # availability matrix pure helpers
│   │   └── format.ts         # folio/moneda/fecha formatting
│   └── pages/
│       └── cotizaciones-page.tsx
└── routes/
    └── catalogos/
        └── cotizaciones.tsx            # EXISTE (placeholder) — se reemplaza el contenido por CotizacionesPage + guard admin
```

**Structure Decision**: Single-project SPA layout mirroring `src/features/proveedores/` (components / data / logic / pages) so the established test and mock-repository conventions are reused verbatim. The pre-existing empty `src/features/cotizaciones/` directory becomes the feature home; the pre-existing route `src/routes/catalogos/cotizaciones.tsx` (`/catalogos/cotizaciones`, apartado de maestros) is kept — only its placeholder content is replaced by `CotizacionesPage` plus the admin guard (routeTree regenerates).

## Complexity Tracking

> Empty — no Constitution Check violations.

---

## Post-design Constitution Re-check (Phase 1 complete)

All Phase 1 artifacts (research.md, data-model.md, contracts/, quickstart.md) were produced within the gates above: no new dependencies (Radix Tooltip comes from the already-installed `radix-ui` meta-package; shadcn additions are approved design-system primitives), mock-first data access, test-first coverage plan, explicit states, and admin guard reuse. No violations introduced.
