# Research: Project Init

**Date**: 2026-08-02
**Feature**: [spec.md](./spec.md)

Resolves all technical unknowns for the scaffold. No `NEEDS CLARIFICATION`
remained after the clarification session; every decision below is a researched
choice with rationale and alternatives.

## Scaffold base

- **Decision**: Start from the official Vite `react-ts` template, then layer the
  mandated stack on top.
- **Rationale**: Officially maintained, ships a strict `tsconfig`, ESLint flat
  config, and HMR-ready structure; reduces hand-rolled boilerplate.
- **Alternatives considered**: Manual from-scratch config (error-prone,
  rejected); Create React App (deprecated, rejected).

## Build & language

- **Decision**: Vite (latest stable) + TypeScript strict + React 19.
- **Rationale**: Mandated by the constitution; Vite is the current standard for
  Vite-era SPAs and integrates natively with Vitest and @tailwindcss/vite.
- **Alternatives considered**: Webpack (outdated DX, rejected); SWC-based
  frameworks (extra moving parts, rejected).

## Styling & components

- **Decision**: Tailwind CSS v4 via the `@tailwindcss/vite` plugin (CSS-first
  config, no `tailwind.config.js`), Radix UI primitives (individual
  `@radix-ui/react-*` packages installed as needed) for accessible unstyled
  behavior.
- **Rationale**: Constitution mandates both; Tailwind v4 is the current major;
  Radix primitives inherit correct ARIA behavior, satisfying Principle VI.
- **Alternatives considered**: Tailwind v3 with config file (superseded,
  rejected); component libraries with baked-in styles (styling freedom lost,
  rejected).

## Routing

- **Decision**: TanStack Router v1 with file-based routing via the
  `@tanstack/router-vite-plugin` (routes in `src/routes/`).
- **Rationale**: Constitution mandates TanStack Router; file-based routes are
  type-safe, generate a typed route tree, and naturally support code splitting.
- **Alternatives considered**: Code-based route config (more manual, rejected);
  React Router (not the mandated router, rejected).

## Server state & HTTP

- **Decision**: TanStack Query v5 with a single `QueryClient` in the providers;
  native browser `fetch` wrapped in a thin `lib/http` module (JSON handling,
  timeout, error normalization).
- **Rationale**: Constitution mandates both; the wrapper centralizes the error
  contract (see `contracts/http-client.md`) without adding a new dependency.
- **Alternatives considered**: Axios (new dependency, rejected per dependency
  rule); no wrapper (error handling scattered, rejected).

## Global state

- **Decision**: Zustand v5, minimal single store (`app-store.ts`) for scaffold.
- **Rationale**: Constitution mandates Zustand for global/client state.
- **Alternatives considered**: Redux Toolkit (heavier, rejected); Context-only
  (not mandated, rejected for shared state).

## Testing

- **Decision**: Vitest (latest) with two configurations: `node` environment for
  logic tests, and Browser Mode via `@vitest/browser` + Playwright provider
  (Chromium) for component tests. React Testing Library for queries/events.
- **Rationale**: Constitution mandates real-browser component tests; Browser
  Mode with the Playwright provider is the standard, documented Vitest path.
- **Alternatives considered**: jsdom/happy-dom (simulated DOM, rejected by
  decision to make Browser Mode mandatory); WebdriverIO provider (extra setup,
  rejected).

## Environment validation

- **Decision**: Hand-rolled `lib/env/env.ts` that validates required `VITE_*`
  variables at startup and throws on a missing required one (fail-fast), driven
  by a declared schema object.
- **Rationale**: No new dependency (per dependency rule); fail-fast satisfies
  the Environment section. If validation grows, zod can be proposed later via
  consultation.
- **Alternatives considered**: zod (new dependency, deferred); `@t3-oss/env` /
  `envalid` (new dependency or Next-specific, rejected).

## CI

- **Decision**: GitHub Actions single workflow (`.github/workflows/ci.yml`) with
  `actions/setup-node` reading `.nvmrc`, `npm ci`, lint, typecheck, logic tests,
  Playwright browser install, component tests (Browser Mode), and production
  build. Runs on PRs into `main`.
- **Rationale**: Clarified CI platform; browser provisioning required by the
  constitution for component tests.
- **Alternatives considered**: GitLab CI / Azure DevOps (not selected).

## Deployment

- **Decision**: Multi-stage Dockerfile (Node build stage → Nginx serve stage) +
  `nginx/nginx.conf` with SPA fallback (`try_files ... /index.html`), gzip, and
  security headers (CSP, HSTS, X-Frame-Options, X-Content-Type-Options,
  Referrer-Policy). HTTPS terminated at the reverse proxy.
- **Rationale**: Clarified deployment target; containerized Nginx gives full
  control over headers and routing, consistent with the backend's Docker usage.
- **Alternatives considered**: Vercel/Netlify (not selected); serving the static
  build with Node (no header control, rejected).

## Accessibility

- **Decision**: Radix primitives for any complex widget; semantic HTML, labels,
  and keyboard operability enforced in the component contract
  (see `contracts/components.md`); WCAG 2.1 AA target.
- **Rationale**: Constitution Principle VI; Radix already mandated.
- **Alternatives considered**: Custom ARIA (rejected, error-prone).

## Observability

- **Decision**: React error boundary (`app/error-boundary.tsx`) that captures
  render failures; report hook is environment-guarded and ready to receive a
  monitoring SDK. Concrete tool (Sentry/Highlight/etc.) deferred to a later
  consultation per the dependency rule.
- **Rationale**: Constitution requires error tracking in production but keeps
  the tool choice ambiguous until consultation.
- **Alternatives considered**: Picking Sentry now (violates consultation rule,
  rejected); no boundary (violates constitution, rejected).

## Deferred items (documented in spec assumptions)

- SonarQube gate in CI: requires external server/credentials (follow-up).
- Monitoring/error-tracking tool selection: requires consultation (follow-up).
- Backend API integration: separate future feature.
