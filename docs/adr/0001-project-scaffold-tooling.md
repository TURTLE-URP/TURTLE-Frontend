# ADR-0001: Project scaffold tooling

**Status**: Accepted
**Date**: 2026-08-02
**Context**: TURTLE-Frontend is initialized as a Vite + React SPA. The
constitution mandates the technology stack and the production/separation
practices; this ADR records how the scaffold realizes them.
**Decision**: Scaffold from the official Vite `react-ts` template and layer
TypeScript strict, Tailwind CSS v4 (+ `@tailwindcss/vite`), Radix UI
primitives, TanStack Query v5, TanStack Router v1 (file-based), Zustand v5,
native `fetch`, Vitest (node logic tests) + Vitest Browser Mode (Playwright
provider) for component tests, ESLint flat config, Prettier, Node 24 LTS
(`.nvmrc` + `engines`), env fail-fast validation, a feature-first source
layout, GitHub Actions CI, and an Nginx + Docker deployment with security
headers.
**Consequences**:
- New dependencies require prior consultation per the constitution; this
  stack is the approved set for the scaffold.
- Component tests require a browser runtime (Playwright) provisioned locally
  and in CI.
- Deferred: SonarQube CI gate and production monitoring tool (require
  external infrastructure/consultation).
