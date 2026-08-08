# Tasks: Project Init

**Input**: Design documents from `/specs/001-project-init/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Included — the constitution (Principle III) mandates test-first: logic tests in node environment and component tests in Vitest Browser Mode. Test tasks MUST be written and FAIL before their implementation.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Single project at repository root: `src/`, configs at root
- TanStack Router file-based routes live in `src/routes/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure per plan.md

- [X] T001 Create `.nvmrc` pinning Node 24 (Active LTS) at repository root
- [X] T002 Scaffold Vite react-ts project at repository root (package.json, tsconfig.json with strict mode, vite.config.ts); add `engines` field with Node `>=24` range in package.json and commit package-lock.json
- [X] T003 [P] Configure ESLint flat config in eslint.config.mjs (typescript-eslint, react-hooks, react-refresh) and Prettier in prettier.config.mjs
- [X] T004 [P] Create `.gitignore` (node_modules/, dist/, *.log, .env*) and `.env.template` (VITE_APP_NAME, VITE_API_BASE_URL) at repository root
- [X] T005 Create directory structure per plan: src/app, src/components/ui, src/features/greeting/components, src/features/greeting/logic, src/lib/env, src/lib/http, src/routes, src/stores, src/styles

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T006 [P] Configure Vitest `node` environment for logic tests in vitest.config.ts
- [X] T007 [P] Configure Vitest Browser Mode (Playwright provider, Chromium) for component tests in vitest.config.ts
- [X] T008 [P] Configure Tailwind CSS v4 via `@tailwindcss/vite` in vite.config.ts and create src/styles/index.css
- [X] T009 [P] Configure TanStack Router file-based routing (`@tanstack/router-vite-plugin` in vite.config.ts); create src/routes/__root.tsx with layout wrapper
- [X] T010 [P] Configure TanStack Query QueryClient in src/app/providers.tsx
- [X] T011 [P] Install Radix UI primitives (@radix-ui/react-slot, @radix-ui/react-dialog)
- [X] T012 Write logic tests for env validation in src/lib/env/env.test.ts (fail-fast behavior, missing required var) — MUST FAIL before T013
- [X] T013 Implement env validation in src/lib/env/env.ts (schema-driven fail-fast per contracts/environment.md) — depends on T012
- [X] T014 Write logic tests for HTTP wrapper in src/lib/http/http.test.ts (JSON, timeout, error normalization per contracts/http-client.md) — MUST FAIL before T015
- [X] T015 Implement HTTP wrapper in src/lib/http/http.ts (native fetch, timeout, standardized HttpError) — depends on T014
- [X] T016 Write logic tests for app store in src/stores/app-store.test.ts — MUST FAIL before T017
- [X] T017 Implement Zustand app store in src/stores/app-store.ts (reads validated env appName) — depends on T016
- [X] T018 Implement error boundary in src/app/error-boundary.tsx (captures render failures, env-guarded report hook)
- [X] T019 [P] Configure GitHub Actions CI in .github/workflows/ci.yml (node-version-file .nvmrc, npm ci, lint, typecheck, logic tests, playwright install chromium, component tests, build, npm audit)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Developer sets up and runs the application locally (Priority: P1) 🎯 MVP

**Goal**: A developer can clone, install, and run the SPA locally following the README, with fail-fast env validation.

**Independent Test**: Clean clone → `nvm use` → `npm ci` → `cp .env.template .env` → `npm run dev` renders the home route in the browser; removing `VITE_APP_NAME` makes startup fail with a clear message.

### Implementation for User Story 1

- [X] T020 [US1] Implement home route in src/routes/index.tsx rendering the layout and greeting example
- [X] T021 [US1] Implement layout with header/nav showing `VITE_APP_NAME` in src/routes/__root.tsx
- [X] T022 [US1] Create README.md covering setup, environment variables, available scripts, and deployment per Documentation section
- [X] T023 [US1] Verify local flow per quickstart.md: `npm ci`, `npm run dev`, and fail-fast probe with missing `VITE_APP_NAME`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Developer verifies quality gates in one pass (Priority: P1)

**Goal**: A single verification flow (lint, typecheck, logic tests, component tests in a real browser, build) passes with zero failures.

**Independent Test**: Run `npm run lint`, `npm run typecheck`, `npm test`, `npm run test:components`, `npm run build` on the scaffold; every command exits 0 and component tests execute in a real browser.

### Tests for User Story 2 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T024 [P] [US2] Write component test for greeting-card in src/features/greeting/components/greeting-card.test.tsx (Browser Mode: props, states, events, accessibility) — MUST FAIL before T027
- [X] T025 [P] [US2] Write logic tests for build-greeting in src/features/greeting/logic/build-greeting.test.ts (morning/afternoon/evening, empty name, hour clamp) — MUST FAIL before T026

### Implementation for User Story 2

- [X] T026 [US2] Implement greeting logic in src/features/greeting/logic/build-greeting.ts (per data-model.md §2) — depends on T025
- [X] T027 [US2] Implement greeting-card component in src/features/greeting/components/greeting-card.tsx (explicit props, JSDoc, Tailwind classes, uses build-greeting) — depends on T026, T024
- [X] T028 [US2] Add npm scripts in package.json: `lint`, `typecheck`, `test`, `test:components`, `build`
- [X] T029 [US2] Verify full gate flow per quickstart.md: lint, typecheck, logic tests, component tests (real browser), production build all pass

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Developer receives a constitution-compliant foundation (Priority: P2)

**Goal**: The scaffold ships the mandated structure, containerized deployment, security headers, and documentation so future features start compliant.

**Independent Test**: Review the repository against the constitution's mandatory items (stack, env template, ignore rules, error boundaries, Dockerfile, nginx security headers, README) and run the container build + header check from quickstart.md.

### Implementation for User Story 3

- [X] T030 [P] [US3] Create nginx/nginx.conf with SPA fallback (`try_files ... /index.html`) and security headers (CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy)
- [X] T031 [P] [US3] Create multi-stage Dockerfile at repository root (Node 24 build stage → Nginx serve stage)
- [X] T032 [US3] Verify container deployment per quickstart.md: `docker build -t turtle-frontend .`, run on port 8080, confirm 200 on `/` and deep link, and required security headers via `curl -I`
- [X] T033 [US3] Confirm no developer-only features, hardcoded environment values, or `console.log` remain in src/ (Principles II and V)

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T034 [P] Run quickstart.md end-to-end validation (setup → dev → gates → container)
- [X] T035 [P] Verify accessibility basics on the home route (keyboard operability, visible focus, labels) per Principle VI
- [X] T036 [P] Verify env validation and error boundary behavior in the production build (no dev-only leaks)
- [X] T037 [P] Confirm ADR-0001 reflects the final implemented decisions; update if implementation diverged
- [X] T038 [P] Final `npm audit` and dependency compatibility review (no high/critical, mutually compatible versions)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - US1 and US2 are both P1; implement US1 first (running app), then US2 (gates), then US3 (P2)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational - Requires the example component from US1's home route to be exercised; independently testable
- **User Story 3 (P2)**: Can start after Foundational - Independently testable (container build does not depend on US1/US2 internals)

### Within Each User Story

- Tests MUST be written and FAIL before implementation (T024/T025 before T026/T027; T012/T014/T016 before T013/T015/T017)
- Foundational infra before story work
- Logic before components
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] (T003, T004) can run in parallel with T001/T002/T005
- All Foundational config tasks marked [P] (T006–T011, T019) can run in parallel; env/http/store implementations (T013/T015/T017) wait on their tests
- US2 tests (T024, T025) can run in parallel
- US3 tasks (T030, T031) can run in parallel
- Different user stories can be worked on in parallel by different team members after Foundational completes

---

## Parallel Example: User Story 2

```bash
# Launch both tests for User Story 2 together (fail-first):
Task: "Write component test for greeting-card in src/features/greeting/components/greeting-card.test.tsx"
Task: "Write logic tests for build-greeting in src/features/greeting/logic/build-greeting.test.ts"

# After both fail as expected, implement:
Task: "Implement greeting logic in src/features/greeting/logic/build-greeting.ts"
Task: "Implement greeting-card component in src/features/greeting/components/greeting-card.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: App runs locally with fail-fast env
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready (configs, env, http, store, error boundary, CI)
2. Add User Story 1 → running local app (MVP!)
3. Add User Story 2 → quality gates all green in one pass
4. Add User Story 3 → containerized deployment with security headers
5. Polish: quickstart end-to-end, a11y, audit

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 3 (independent)
   - Developer C: User Story 2 (after US1 component exists)
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing (constitution Principle III)
- Commit after each task or logical group (Conventional Commits per Git Workflow section)
- Stop at any checkpoint to validate story independently
- Deferred by design: SonarQube CI gate and monitoring tool (external infra/consultation) — not tasks in this feature
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence

---

## Phase 7: Convergence

**Purpose**: Close the gap between the artifacts and the design-system work
implemented after the original phases (shadcn/ui setup, brand theme tokens,
fonts, path aliases). Findings from `/speckit.converge` on 2026-08-08.

- [X] T039 Record justification for the new design-system dependencies (shadcn, radix-ui, class-variance-authority, clsx, tailwind-merge, tw-animate-css, @phosphor-icons/react, @fontsource-variable/jetbrains-mono, vite-tsconfig-paths) by amending docs/adr/0001-project-scaffold-tooling.md and backfilling spec/plan/tasks/contracts/README in the same PR, per Constitution Tech Stack dependency rules + Documentation (contradicts) — CRITICAL
- [X] T040 Backfill spec.md (FR-002/FR-014 + Clarifications) and plan.md (Primary Dependencies + Project Structure) to cover the shadcn/ui design-system layer (components.json, src/components/ui/button.tsx, src/lib/utils.ts, @theme tokens in src/styles/index.css, `@/*` aliases via vite-tsconfig-paths), per spec FR-002/FR-014 and plan: structure (unrequested)
- [X] T041 Add @fontsource-variable/montserrat and @fontsource-variable/playfair-display to package.json and import them in src/styles/index.css so the declared --font-sans/--font-serif resolve, per design-system font tokens (partial)
- [X] T042 Migrate hardcoded zinc-* classes to design tokens in src/routes/__root.tsx and src/features/greeting/components/greeting-card.tsx (bg-background, border-border, text-foreground, text-muted-foreground, bg-card), per design system + Constitution VI dark mode (partial)
- [X] T043 Update specs/001-project-init/data-model.md §3 so ui.theme reflects the light/dark theme system now supported via `.dark` class + CSS variables (still reserved in the store), per data-model §3 (partial)
- [X] T044 Update spec.md FR-014 and quickstart.md expected output to cover the additional `<Button>` example on the home route, per spec FR-014 (unrequested)
