<!--
  Sync Impact Report
  Version: 1.1.0 → 1.2.0
  Modified principles: n/a (principles added)
  Added principles: VI. Accessibility (a11y), VII. Code Quality Gates (SonarQube)
  Added sections: Environment & Configuration, Git Workflow & Conventions,
    Observability & Production Monitoring, Documentation
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

### VI. Accessibility (a11y)

The SPA MUST meet WCAG 2.1 AA as the accessibility target.

- Every interactive element MUST be operable via keyboard, with a visible
  focus indicator.
- Forms MUST ship with labels and accessible error messages.
- Complex widgets (dialog, menu, tooltip, tabs, etc.) MUST be built on Radix
  UI primitives to inherit correct ARIA behavior.
- Color contrast MUST meet WCAG AA; information MUST NOT be conveyed by color
  alone.
- Rationale: Accessibility is part of product quality, and the Radix primitives
  already mandated by the Technology Stack provide the correct behavior for
  free.

### VII. Code Quality Gates (SonarQube)

SonarQube analysis MUST run as a CI gate and the quality gate MUST be green
before any merge to `main`.

- No new Bugs, Vulnerabilities, or Security Hotspots are allowed.
- New code MUST meet the coverage threshold (≥ 80%) and duplication limits.
- SonarQube findings MUST be addressed or explicitly justified before merge.
- Rationale: An automated quality gate catches maintainability and security
  issues that linting and unit tests alone cannot.

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
CI validation → merge → release, with the PR gate required when entering
`main` (see Git Workflow & Conventions).

- CI MUST run lint, typecheck, tests, and the production build on every pull
  request into `main`; the PR MUST NOT merge unless all gates pass.
- Every feature MUST reference its spec and related tests in the PR
  description.
- A release checklist MUST be completed before deployment: green CI,
  audited dependencies, verified security headers, smoke-tested critical
  paths, and a rollback plan.
- Releases MUST be tagged and versioned; production changes MUST be
  revertible.

## Environment & Configuration

The development environment MUST be reproducible and consistent across the
team.

- Node.js LTS MUST be used and pinned in `.nvmrc`.
- CI MUST install and run with the Node version defined in `.nvmrc` (e.g.
  `node-version-file: .nvmrc`).
- `package.json` MUST declare an `engines` field with the supported LTS range.
- npm is the package manager of record; package-lock files MUST be committed.
- All environment variables MUST be declared in `.env`/`.env.template` with
  the `VITE_` prefix and validated at startup; a missing required variable
  MUST fail fast.
- Environment-specific values MUST NOT be hardcoded in source.

## Git Workflow & Conventions

The SPA MUST be developed through a feature-branch workflow with Conventional
Commits.

- Each feature MUST be developed on its own branch derived from the latest
  `main`, referencing its spec.
- Commit messages MUST follow Conventional Commits (`feat:`, `fix:`, `docs:`,
  `refactor:`, `test:`, `chore:`).
- **Merge policy (hybrid)**: direct merges between feature/integration
  branches are allowed without a PR; merging into `main` MUST go through a PR
  with review approval and green CI + SonarQube.
- `main` MUST be protected and always deployable.
- PRs MUST be small, reference the feature spec, and pass all gates before
  merging.

## Observability & Production Monitoring

The SPA MUST be observable in production, not only in development.

- Error tracking MUST be active in production, configured via environment
  variables, so runtime errors are captured and visible to the team.
- Error boundaries MUST catch render failures and report them.
- Core Web Vitals MUST be monitored in production; regressions MUST be
  addressed.
- Error reports MUST include context (route, component, relevant state)
  without leaking secrets or personal data.
- The concrete monitoring tool MUST be selected after prior consultation,
  following the dependency rules in the Technology Stack.

## Documentation

Documentation MUST travel with the code it describes.

- The repository MUST maintain a README covering setup, environment
  variables, available scripts, and deployment.
- Public components MUST document their props and usage.
- Architecture decisions that affect the Technology Stack MUST be recorded
  as ADRs.
- Documentation MUST be updated in the same PR as the change it describes.

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

**Version**: 1.2.0 | **Ratified**: 2026-08-02 | **Last Amended**: 2026-08-02
