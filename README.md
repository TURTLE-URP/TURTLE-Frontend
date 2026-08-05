# TURTLE Frontend

Single-page application (SPA) scaffold built with Vite + React, compliant with
the [TURTLE-Frontend constitution](./.specify/memory/constitution.md) v1.3.0.

## Stack

- **Vite 8 + React 19** (TypeScript strict)
- **Tailwind CSS v4** for styling, **Radix UI** primitives for accessible widgets
- **TanStack Router** (file-based routes) + **TanStack Query** (server state)
- **Zustand** for global client state; native `fetch` for HTTP
- **Vitest** — logic tests (node env) + component tests (Browser Mode / Playwright)

## Requirements

- Node.js 24 LTS (see `.nvmrc`; `nvm use`)
- npm
- Playwright Chromium for component tests: `npx playwright install chromium`

## Setup

```sh
nvm use                 # resolves Node 24 from .nvmrc
npm ci                  # installs from the lockfile
cp .env.template .env   # provide real values
```

## Environment variables

| Variable            | Required | Description                   |
| ------------------- | -------- | ----------------------------- |
| `VITE_APP_NAME`     | yes      | Application name (1–50 chars) |
| `VITE_API_BASE_URL` | no       | Absolute backend URL, if any  |

Values are read from `.env` (gitignored) at **build time**: Vite inlines
`VITE_*` variables into the bundle when `npm run build` runs. A missing
required variable fails fast at startup with a message naming the variable.
Runtime variables (`docker run --env ...`) never reach the client-side JS.

## Available scripts

| Script                    | Description                                             |
| ------------------------- | ------------------------------------------------------- |
| `npm run dev`             | Start the dev server                                    |
| `npm run build`           | Type-check and produce the production build in `dist/`  |
| `npm run preview`         | Preview the production build locally                    |
| `npm run lint`            | ESLint over the repository                              |
| `npm run format`          | Format with Prettier                                    |
| `npm run typecheck`       | `tsc -b` type check                                     |
| `npm test`                | Logic tests (node environment)                          |
| `npm run test:components` | Component tests in a real browser (Vitest Browser Mode) |
| `npm run test:all`        | All test projects                                       |
| `npm run audit`           | `npm audit` (fails on high/critical)                    |

## Quality gates

```sh
npm run lint
npm run typecheck
npm test
npm run test:components
npm run build
```

Every command must exit 0 before merging. CI (`.github/workflows/ci.yml`)
runs all gates plus `npm audit` on every pull request into `main`.

## Deployment (containerized)

A multi-stage Dockerfile builds the SPA with Node 24 and serves it with Nginx
(SPA fallback + security headers). Because `VITE_*` variables are build-time,
pass them with `--build-arg` (real `.env` files are excluded from the image):

```sh
docker build --build-arg VITE_APP_NAME="TURTLE Frontend" -t turtle-frontend .
docker run -p 8080:80 turtle-frontend
curl -I http://localhost:8080   # expect 200 + security headers
```

If `VITE_APP_NAME` is not provided at build time, the client app fails fast
with a message naming the missing variable.

The app must be served over HTTPS in production.

## Project structure

```text
src/
├── app/            # Composition root: providers, router, error boundary
├── components/ui/  # Presentational primitives
├── features/       # Self-contained feature slices (components/ + logic/)
├── lib/            # Framework-free utilities (env validation, HTTP wrapper)
├── routes/         # TanStack Router file-based routes
├── stores/         # Zustand stores
└── styles/         # Global styles
```

## Contributing

- Feature branches derived from the latest `main`, referencing the feature spec in `specs/`.
- Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`).
- Merging into `main` requires a PR with green CI and review approval.
- See `specs/001-project-init/quickstart.md` for the runnable validation flow.
