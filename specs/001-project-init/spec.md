# Feature Specification: Project Init

**Feature Branch**: `001-project-init`

**Created**: 2026-08-02

**Status**: Draft

**Input**: User description: "inicializar projecto con las indicaciones especificadas en el @.specify/memory/constitution.md"

## Clarifications

### Session 2026-08-02

- Q: ¿En qué plataforma de CI se implementará el pipeline mandatado? → A: GitHub Actions
- Q: ¿Cuál será el destino de despliegue de la SPA en producción? → A: Nginx + Docker
- Q: ¿Qué versión LTS de Node.js se fija en .nvmrc y en el campo engines del package.json? → A: Node 24
- Q: ¿Qué contenido tendrá la UI inicial del scaffold? → A: Shell mínimo con ejemplo (routing, layout, home route, error boundary y un componente de ejemplo)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Developer sets up and runs the application locally (Priority: P1)

A developer clones the repository for the first time, follows the README,
installs dependencies, and starts the development environment without
manual configuration beyond providing their own local environment values.

**Why this priority**: Without a working local setup nothing else in the
project can be built, tested, or reviewed. It is the foundation of every
other story.

**Independent Test**: Clone the repository into a clean directory, execute
the documented setup steps, and verify the app renders in a browser on
localhost with no setup errors.

**Acceptance Scenarios**:

1. **Given** a clean clone of the repository, **When** the developer follows
   the README setup instructions, **Then** dependencies install successfully
   with the pinned Node version and no manual version changes are required.
2. **Given** the project installed, **When** the developer runs the dev
   server command, **Then** the application opens in the browser and renders
   the initial screen without errors.
3. **Given** a missing required environment variable, **When** the
   application starts, **Then** it fails fast with a clear message naming the
   missing variable instead of failing silently at runtime.

---

### User Story 2 - Developer verifies quality gates in one pass (Priority: P1)

A developer can run a single verification flow that checks the mandated
quality gates — code style, types, unit tests, component tests, and the
production build — and get a clear pass/fail result before opening a PR.

**Why this priority**: The constitution makes these gates non-negotiable
before merging. Providing them as part of the project initialization means
compliance is the default, not an afterthought.

**Independent Test**: Run the documented verification commands on a fresh
checkout and confirm every gate reports success with zero errors.

**Acceptance Scenarios**:

1. **Given** the initialized project, **When** the developer runs the lint
   and format checks, **Then** they pass with no errors or warnings.
2. **Given** the initialized project, **When** the developer runs the logic
   tests, **Then** all pass in the node environment without a browser.
3. **Given** the initialized project, **When** the developer runs the
   component tests, **Then** they execute in a real browser (Browser Mode)
   and all pass.
4. **Given** the initialized project, **When** the developer runs the
   production build, **Then** it completes with zero TypeScript errors.

---

### User Story 3 - Developer receives a constitution-compliant foundation (Priority: P2)

The initialized project ships with the mandated architecture, tooling, and
documentation so every future feature starts from a compliant base.

**Why this priority**: This is the enabler for all subsequent features; it
can be demonstrated once and validated by review, so it ranks below the two
must-have running stories.

**Independent Test**: Review the generated project structure and
configuration against the constitution's mandatory items and confirm each is
present and functional.

**Acceptance Scenarios**:

1. **Given** the initialized project, **When** the repository structure is
   reviewed, **Then** it includes the mandated technology stack
   configuration, a minimal UI shell (routing, layout, home route, an error
   boundary, and one example component), an environment template, ignore
   rules for secrets, and a README covering setup, variables, scripts, and
   deployment.
2. **Given** the initialized project, **When** the runtime is exercised,
   **Then** unexpected render errors are captured by error boundaries and no
   developer-only features or hardcoded environment values are visible.
3. **Given** the initialized project, **When** a component is added, **Then**
   it ships with its own component test and any business logic it contains
   is covered by a separate logic test.

---

### Edge Cases

- What happens when the developer's local Node version does not match the
  pinned version? → The project must surface a clear version mismatch
  message and the package manager must refuse to run under an unsupported
  version.
- How does the system handle a missing required environment variable? → The
  app fails fast at startup with an explicit message identifying the missing
  variable.
- What happens when the browser runtime for component tests is not available
  in the environment? → The verification flow must fail with guidance on
  provisioning the browser, never silently skip component tests.
- How are secrets handled? → Environment files containing real values are
  never tracked; only a template is committed and real values are ignored.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The repository MUST be initialized as a single-page application
  built with Vite and React, per constitution Principle I.
- **FR-002**: The project MUST include the mandated technology stack:
  Tailwind CSS for styling, Radix UI primitives for components, TanStack
  Query for data fetching, TanStack Router for routing, Zustand for global
  state, and native `fetch` for HTTP, per the Technology Stack section.
- **FR-003**: The project MUST pin Node.js 24 (Active LTS) in `.nvmrc`, declare
  the supported range in `package.json` `engines`, use npm as the package
  manager, and commit the lockfile.
- **FR-004**: Environment configuration MUST follow `.env`/`.env.template`
  with the `VITE_` prefix; a missing required variable MUST fail fast at
  startup with a clear message.
- **FR-005**: Code style and type gates MUST be configured and operational:
  ESLint, Prettier, and TypeScript in strict mode.
- **FR-006**: Testing MUST be configured for both levels mandated by
  Principle III: logic tests running in the node environment, and component
  tests running in a real browser (Vitest Browser Mode); the verification
  flow MUST provision or require the browser runtime for component tests.
- **FR-007**: The production build MUST complete with zero TypeScript errors,
  with code splitting and lazy loading enabled for routes and heavy views.
- **FR-008**: The project MUST include a README covering setup, environment
  variables, available scripts, and deployment, per the Documentation
  section.
- **FR-009**: Security MUST be handled from the start: real secrets MUST NOT
  be committed, environment files with real values MUST be ignored, and
  untrusted content MUST NOT be rendered without sanitization, per Principle
  IV.
- **FR-010**: The runtime MUST include error boundaries so render failures
  are captured and reportable, per the Observability section.
- **FR-011**: Dependency security MUST be verifiable: the project MUST be
  auditable with the package manager's audit command with no high or
  critical vulnerabilities before release, per the Security Requirements
  section.
- **FR-012**: The repository MUST include a CI pipeline on GitHub Actions
  that runs lint, typecheck, logic tests, component tests (with browser
  provisioning), and the production build on every PR into `main`.
- **FR-013**: The project MUST include a containerized deployment (Nginx
  serving the static build) with security headers configured (CSP,
  X-Frame-Options, HSTS), per the Security Requirements section.
- **FR-014**: The initial application MUST ship a minimal UI shell: routing
  with a home route, a layout with header/navigation, an error boundary, and
  one example component that demonstrates the mandated component-test
  pattern; any business logic in the example MUST be covered by a separate
  logic test.

### Key Entities

No persistent business data is involved in project initialization. The
deliverable is the repository scaffold and its tooling configuration.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A developer can go from a clean clone to a running app in
  under 15 minutes by following the README.
- **SC-002**: A single documented verification flow reports all quality gates
  (style, types, logic tests, component tests, production build) passing with
  zero failures.
- **SC-003**: The initialized project satisfies the constitution's mandatory
  items with no open compliance gaps at review.
- **SC-004**: The production build completes with zero TypeScript errors and
  the initial bundle uses code splitting for routes and heavy views.

## Assumptions

- Node.js 24 (Active LTS) is pinned in `.nvmrc` and declared in the
  `engines` field; it may be bumped when a newer LTS is adopted.
- npm is the package manager of record (consistent with the mandated
  `npm audit` security checks and the locked dependency file).
- The concrete production monitoring/error-tracking tool is NOT selected
  during initialization; per the constitution it must be chosen after prior
  consultation and configured later via environment variables.
- The SonarQube quality gate is enforced in CI as a follow-up, since it
  requires external infrastructure (server/credentials) outside the scope of
  local initialization; the local verification flow covers lint, types,
  tests, and build.
- No backend API is wired up yet; only the data-fetching foundation is
  scaffolded and the first real integration will be specified as a separate
  feature.
- CI configuration for the mandated pipeline runs on GitHub Actions (lint,
  typecheck, tests with browser provisioning, build) and is part of this
  feature's deliverable.
- Production deployment targets Nginx serving the static build inside a
  container; the Dockerfile, Nginx configuration, and deployment
  documentation are part of this feature's deliverable.
