# Implementation Plan: Project Init

**Branch**: `001-project-init` | **Date**: 2026-08-02 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-project-init/spec.md`

## Summary

Initialize the TURTLE-Frontend repository as a Vite + React SPA scaffold that is
compliant with the project constitution v1.3.0: TypeScript strict, Tailwind CSS
+ Radix UI, TanStack Query + TanStack Router, Zustand, native `fetch`, Vitest
logic tests (node) and component tests (Browser Mode), ESLint + Prettier,
Node 24 LTS pinned, environment fail-fast validation, a minimal UI shell (layout,
home route, error boundary, one example component), GitHub Actions CI with the
mandated gates, and an Nginx + Docker production deployment with security
headers. Monitoring tool and SonarQube server are deferred per the constitution.

## Technical Context

**Language/Version**: TypeScript (strict mode), React 19, Node.js 24 (Active LTS)

**Primary Dependencies**: Vite, Tailwind CSS v4, shadcn/ui (preset
`radix-lyra`) with `class-variance-authority`, `clsx`, `tailwind-merge` and
`cn` in `src/lib/utils.ts`, Radix UI primitives, TanStack Query v5, TanStack
Router v1, Zustand v5, `@phosphor-icons/react`, Fontsource variable fonts
(Montserrat, Playfair Display, JetBrains Mono), Vitest + @vitest/browser
(Playwright), React Testing Library, ESLint (flat config), Prettier.
`@/*` path aliases are resolved via Vite's native `resolve.tsconfigPaths`.

**Storage**: N/A (SPA; no persistent data in this feature)

**Testing**: Vitest in `node` environment for logic tests; Vitest Browser Mode
(Playwright provider, Chromium) for component tests

**Target Platform**: Modern evergreen browsers (ES2022+); served by Nginx in a
Docker container on Linux

**Project Type**: Frontend SPA (web application)

**Performance Goals**: Initial load auditable; Core Web Vitals (LCP < 2.5s on
3G) as the target; code splitting and lazy loading for routes

**Constraints**: No high/critical `npm audit` vulnerabilities; WCAG 2.1 AA;
HTTPS only with security headers (CSP, HSTS, X-Frame-Options); env fail-fast;
no new dependency without consultation

**Scale/Scope**: Greenfield scaffold for a small team; no backend wiring in this
feature

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Section | Gate | Status |
|---------|------|--------|
| Principle I (SPA, Vite+React, components, Zustand, code splitting) | Scaffold is Vite+React SPA with component decomposition, Zustand store, lazy routes | PASS |
| Principle II (TS strict, ESLint+Prettier, no console.log/dead code) | Strict tsconfig, ESLint flat config, Prettier, lint scripts | PASS |
| Principle III (logic tests node; component tests Browser Mode; per-component tests) | Vitest node env + @vitest/browser with Playwright; example component ships both test kinds | PASS |
| Principle IV (no secrets, env gitignored, no unsafe HTML) | .env.template committed, real .env gitignored, no dangerouslySetInnerHTML | PASS |
| Principle V (build zero errors, optimized, error boundaries, loading/empty/error) | Build script, code splitting, error boundary component, state patterns documented | PASS |
| Principle VI (WCAG 2.1 AA, Radix for complex widgets) | Radix primitives available; a11y noted in component contract | PASS |
| Principle VII (SonarQube gate) | Deferred to CI follow-up (requires external infra) — documented in assumptions | PASS (deferred) |
| Technology Stack (Tailwind, Radix, TanStack Q/R, Zustand, fetch) | All mandated deps in package.json; no extra HTTP client | PASS |
| Design System (shadcn/ui + deps) | shadcn/ui, CVA, clsx, tailwind-merge, Phosphor, Fontsource fonts added on top of the mandated stack; justified and recorded in ADR-0001 (dependency consultation rule) | PASS |
| Security Requirements (HTTPS, headers, npm audit) | nginx.conf with headers; `npm audit` script | PASS |
| Environment (Node 24 .nvmrc, engines, npm, CI browser provisioning, env fail-fast) | .nvmrc=24, engines field, npm, Playwright install in CI, env validation util | PASS |
| Git Workflow (Conventional Commits, hybrid merge) | Documented in README contributing notes | PASS |
| Observability (error tracking env-configured; error boundaries) | Error boundary present; monitoring tool deferred by consultation rule | PASS (deferred) |
| Documentation (README, props docs, ADRs) | README + component props docs (JSDoc) + ADR-0001 for tooling decisions | PASS |

**Result**: No unjustified violations. Two items (SonarQube gate, monitoring
tool) are deferred with explicit rationale; they do not block local init.

## Project Structure

### Documentation (this feature)

```text
specs/001-project-init/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
/ (repo root)
├── .github/workflows/ci.yml
├── .env.template
├── .gitignore
├── .nvmrc
├── components.json          # shadcn/ui configuration
├── Dockerfile
├── nginx/nginx.conf
├── README.md
├── eslint.config.mjs
├── package.json
├── prettier.config.mjs
├── tsconfig.json            # @/* path alias
├── vite.config.ts            # react, tailwindcss, tanstackRouter, native tsconfigPaths
├── vitest.config.ts
└── src/
    ├── app/
    │   ├── error-boundary.tsx
    │   └── providers.tsx
    ├── components/
    │   └── ui/
    │       └── button.tsx   # shadcn UI primitive (CVA variants + cn)
    ├── features/
    │   └── greeting/
    │       ├── components/
    │       │   ├── greeting-card.tsx
    │       │   └── greeting-card.test.tsx
    │       └── logic/
    │           ├── build-greeting.ts
    │           └── build-greeting.test.ts
    ├── lib/
    │   ├── env/
    │   │   ├── env.ts
    │   │   └── env.test.ts
    │   ├── http/
    │   │   └── http.ts
    │   └── utils.ts          # cn() class-merge utility
    ├── routes/
    │   ├── __root.tsx
    │   └── index.tsx
    ├── stores/
    │   └── app-store.ts
    └── styles/
        └── index.css         # theme tokens (light/dark), fonts
```

**Structure Decision**: Feature-first SPA layout (Option 1 adapted). Source is
decomposed into `app/` (composition root), `components/ui/` (presentational
primitives), `features/<name>/` (self-contained feature slices with
co-located `components/` + `logic/` + tests), `lib/` (framework-free utilities
such as env validation and the fetch wrapper), `routes/` (TanStack Router
file-based routes), and `stores/` (Zustand). Tests are co-located next to the
code they cover, satisfying the per-component and per-logic-module test rules.

## Complexity Tracking

No constitution violations requiring justification — table intentionally empty.
