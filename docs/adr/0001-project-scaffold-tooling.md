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

**Amendment (2026-08-08)**: Adopt a shadcn/ui design-system layer on top of
the mandated Tailwind + Radix stack (preset `radix-lyra`, `components.json`,
`@/*` aliases via `vite-tsconfig-paths`). UI primitives live in
`src/components/ui/` built with `class-variance-authority` variants and the
`cn` utility (`clsx` + `tailwind-merge`); icons come from
`@phosphor-icons/react`; fonts are Fontsource variable fonts (JetBrains Mono,
Montserrat, Playfair Display). `src/styles/index.css` defines semantic theme
tokens (OKLCH brand palette: blue primary, green secondary, purple accent)
with a `.dark` variant; components MUST use these tokens rather than
hardcoded palette colors. **Justification (dependency consultation rule)**:
these additions are maintained, mutually compatible with the mandated stack,
and satisfy `npm audit`; they standardize how Tailwind + Radix primitives are
composed and reduce bespoke component CSS. The initial `npx shadcn init`
preset (radix-lyra) set the base theme, later restyled to the brand palette.

**Consequences**:
- New dependencies require prior consultation per the constitution; this
  stack is the approved set for the scaffold.
- Component tests require a browser runtime (Playwright) provisioned locally
  and in CI.
- UI primitives MUST be added through the shadcn flow so tokens, CVA, and
  `cn` stay consistent.
- Deferred: SonarQube CI gate and production monitoring tool (require
  external infrastructure/consultation).
