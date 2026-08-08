# Quickstart: Project Init

**Date**: 2026-08-02
**Feature**: [spec.md](./spec.md)

Runnable validation scenarios proving the scaffold works end-to-end.
Contracts: [environment](./contracts/environment.md),
[http-client](./contracts/http-client.md), [components](./contracts/components.md).
Data model: [data-model.md](./data-model.md).

## Prerequisites

- Node.js 24 LTS (`.nvmrc`; `nvm use` if needed).
- npm (package manager of record).
- Git.
- For component tests: Playwright browsers (`npx playwright install chromium`).

## Setup

```sh
nvm use                 # resolves to Node 24 from .nvmrc
npm ci                  # installs from lockfile
cp .env.template .env   # provide real values (VITE_APP_NAME)
```

**Expected**: clean install, no peer conflicts, `npm audit` shows no
high/critical vulnerabilities.

## Run the app

```sh
npm run dev             # http://localhost:5173
```

**Expected**: browser opens the home route rendered inside the layout
(header/nav); greeting example renders with the configured `VITE_APP_NAME`,
alongside the shadcn `Button` ("Hola gobernador") styled with the brand theme
tokens (Montserrat/JetBrains Mono, brand palette); the layout and greeting use
theme tokens so they follow light/dark mode.

**Failure probe**: remove `VITE_APP_NAME` from `.env` and restart — the app
must fail fast with a message naming the missing variable.

## Quality gates

```sh
npm run lint            # ESLint: zero errors
npm run typecheck       # tsc --noEmit: zero errors
npm test                # logic tests in node env: all pass
npm run test:components # component tests in a real browser: all pass
npm run build           # production build: zero TypeScript errors, code split
```

**Expected**: every command exits 0. Component tests execute in a real
browser (Vitest Browser Mode / Playwright).

## Container build (deployment)

`VITE_*` variables are build-time: they are inlined by Vite when the image
is built (the real `.env` is excluded from the image context), so pass them
via `--build-arg`. Runtime `--env` on `docker run` does NOT affect the
client-side JS.

```sh
docker build --build-arg VITE_APP_NAME="TURTLE Frontend" -t turtle-frontend .
docker run -p 8080:80 turtle-frontend
curl -I http://localhost:8080
```

**Expected**: image builds; serving Nginx returns 200 on `/` and on a deep
link (SPA fallback); response headers include `Content-Security-Policy`,
`Strict-Transport-Security`, `X-Frame-Options`, `X-Content-Type-Options`,
`Referrer-Policy`. The bundle must contain the `VITE_APP_NAME` value passed at
build time; if it is missing, the client app fails fast in the browser with a
message naming the variable.

## CI

`.github/workflows/ci.yml` (GitHub Actions) runs lint, typecheck, logic
tests, component tests (with Playwright browser install), and build on every
PR into `main`. SonarQube gate is a documented follow-up.
