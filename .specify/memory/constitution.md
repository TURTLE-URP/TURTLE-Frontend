<!--
  Sync Impact Report
  Version: 1.0.0 → 1.1.0
  Modified principles: I. SPA Architecture (state solution pinned to Technology Stack)
  Added sections: Technology Stack
  Removed sections: n/a
  Deferred TODOs: n/a
-->
# TURTLE-Frontend Constitution

## Core Principles

### I. SPA Architecture (Vite + React)

The application MUST be built as a single-page application (SPA) using Vite
and React. The UI MUST be decomposed into small, reusable, self-contained
components with explicit props interfaces and a single responsibility.

- Component state MUST live where it is needed; shared state MUST be managed
  with Zustand (see Technology Stack) and never through component-orphaned
  globals or direct DOM manipulation.
- Code splitting and lazy loading MUST be used for routes and heavy views so
  the initial bundle stays lean.
- Rationale: A component-first architecture keeps the SPA maintainable as it
  grows and enables independent testing of each unit.

### II. TypeScript & Code Quality (NON-NEGOTIABLE)

All source code MUST be written in TypeScript with `strict` mode enabled.
Type safety is the first line of defense against regressions.

- `any` MUST NOT be used without an explicit, reviewed justification.
- ESLint and Prettier MUST run without errors before any merge.
- Dead code, unused imports, commented-out code, and `console.log` statements
  MUST NOT reach the production bundle.
- Rationale: Enforcing strict types and clean lint/format gates makes reviews
  predictable and catches a large class of bugs before runtime.

### III. Test-First (NON-NEGOTIABLE)

Tests MUST be written and approved before feature implementation, following
the red-green-refactor cycle. This is a mandatory, non-negotiable rule.

- Unit tests MUST be written with Vitest.
- Component/interaction tests MUST be written with React Testing Library.
- Critical paths (authentication, data fetching, forms, checkout-like flows)
  MUST have coverage.
- A feature without passing tests MUST NOT be merged.
- Rationale: Tests-first keeps the specification executable and prevents
  regressions as the SPA evolves.

### IV. Security by Design

Security MUST be treated as a design constraint, not an afterthought.

- Secrets and API keys MUST NEVER be committed to the repository; environment
  configuration MUST go through `.env` files (using the `VITE_` prefix) and
  `.env` files MUST be gitignored.
- All external data MUST be validated before use; untrusted HTML MUST NOT be
  rendered via `dangerouslySetInnerHTML` without sanitization.
- Authentication tokens MUST be stored using the safest available mechanism
  for the app's threat model; tokens MUST NOT be exposed to logs or the
  bundle as plaintext secrets.
- Rationale: SPAs run untrusted code in the browser; a single injection or
  leaked secret can compromise every user.

### V. Production Readiness

Nothing ships to production unless it meets the release bar.

- `npm run build` (Vite) MUST complete with zero TypeScript errors.
- The production bundle MUST be optimized: code splitting, lazy loading, and
  tree shaking enabled.
- The app MUST ship with error boundaries, explicit loading/empty/error
  states, and no developer-only features visible to end users.
- Performance budget: the initial load MUST be audited before release and
  regressions MUST be addressed before merge.
- Rationale: A clean, optimized, observable bundle is what makes the SPA
  reliable for real users in production.

## Technology Stack

The stack below is mandatory for TURTLE-Frontend. It is selected to maximize
design freedom while keeping the bundle lean and the codebase consistent.

- **Styling**: Tailwind CSS MUST be used for all component styling.
- **Components**: Radix UI primitives MUST be used as the base for accessible,
  unstyled component behavior, allowing full design freedom on top.
- **Data fetching**: TanStack Query MUST be used for server state (fetching,
  caching, and synchronization).
- **Routing**: TanStack Router MUST be used for client-side routing.
- **Global state**: Zustand MUST be used for global/client-side state.
- **HTTP**: The native browser `fetch` API MUST be used for HTTP requests; no
  additional HTTP client library is required.

Dependency rules:

- All dependencies MUST be LTS or actively maintained, mutually compatible
  with the versions above, and meet package security standards (`npm audit`
  with no high or critical vulnerabilities).
- A new dependency MUST NOT be introduced without prior consultation. Any
  addition MUST be reviewed and justified, preferring the option that fits
  best with the existing stack.

## Security Requirements

Additional constraints that MUST hold at all times:

- The production deployment MUST be served over HTTPS only.
- HTTP security headers (CSP, X-Frame-Options, HSTS, etc.) MUST be configured
  appropriately for the hosting environment.
- Dependencies MUST be audited with `npm audit`; high or critical
  vulnerabilities MUST be resolved or explicitly justified before release.
- Third-party scripts MUST be minimized and their provenance reviewed.
- User input on forms and URLs MUST be validated and sanitized.
- Any known vulnerability in a direct dependency MUST NOT ship to production.

## Development Workflow & Production Gate

The development cycle MUST follow: feature branch → local dev → commit →
pull request → CI validation → review approval → merge → release.

- CI MUST run lint, typecheck, tests, and the production build on every pull
  request; the PR MUST NOT merge unless all gates pass.
- Every feature MUST reference its spec and related tests in the PR
  description.
- A release checklist MUST be completed before deployment: green CI,
  audited dependencies, verified security headers, smoke-tested critical
  paths, and a rollback plan.
- Releases MUST be tagged and versioned; production changes MUST be
  revertible.

## Governance

This constitution supersedes any ad-hoc practice and MUST be honored by every
contributor. It governs how TURTLE-Frontend is built, tested, secured, and
released.

- **Amendment procedure**: Any change to this document MUST be proposed as a
  PR, reviewed, and explicitly approved. The amendment MUST record the
  rationale and migration impact.
- **Versioning policy**: Semantic versioning applies. MAJOR for incompatible
  principle removals or redefinitions, MINOR for added principles/sections or
  materially expanded guidance, PATCH for clarifications and wording fixes.
- **Compliance review**: Every review MUST verify adherence to these
  principles. Non-compliance MUST be called out and fixed before merge.
- Complexity MUST be justified; the simplest design that meets the
  specification wins.

**Version**: 1.1.0 | **Ratified**: 2026-08-02 | **Last Amended**: 2026-08-02
