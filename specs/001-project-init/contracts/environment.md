# Contract: Environment Configuration

**Feature**: Project Init | **Date**: 2026-08-02

The environment configuration contract defines how configuration reaches the
SPA and what the startup behavior is. Consumers: app bootstrap, CI, README.

## Rules

- Only `VITE_`-prefixed variables are available to client code (Vite semantics).
- Declared variables live in `.env.template`; real values live in a
  gitignored `.env`.
- The `env.ts` validator declares the schema; a missing **required** variable
  causes the app to fail fast at startup with a message naming the variable.
- Optional variables default to documented values (e.g. empty string).

## Schema

| Variable | Required | Type | Default | Validation |
|----------|----------|------|---------|-----------|
| `VITE_APP_NAME` | yes | string | — | 1–50 chars |
| `VITE_API_BASE_URL` | no | URL | `""` | absolute URL if set |

## Reference

See [data-model.md](../data-model.md) §1 for shapes; `src/lib/env/env.ts` is
the implementation, `src/lib/env/env.test.ts` the logic tests.
