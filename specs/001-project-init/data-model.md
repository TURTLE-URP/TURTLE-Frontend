# Data Model: Project Init

**Date**: 2026-08-02
**Feature**: [spec.md](./spec.md)

This feature introduces no persistent business entities. The "data" present in
the scaffold is limited to: (1) the environment configuration schema, and
(2) the example feature's logic input/output. Contracts for these live in
`contracts/`; this file documents the shapes and their validation rules.

## 1. Environment configuration schema

Source of truth: `src/lib/env/env.ts` (validated at startup, fail-fast).

| Variable | Required | Format | Purpose |
|----------|----------|--------|---------|
| `VITE_APP_NAME` | yes | string, 1-50 chars | Display name used in header/footer |
| `VITE_API_BASE_URL` | no | absolute URL | Reserved for future backend; empty until wired |

Rules:
- Missing required variable → startup throws with the variable name.
- Only `VITE_*`-prefixed variables are exposed to the client (Vite semantics).
- `.env.template` declares the schema; real `.env` is gitignored.

## 2. Example feature (greeting) — logic shape

Source of truth: `src/features/greeting/logic/build-greeting.ts`

| Field | Type | Validation |
|-------|------|-----------|
| `name` | string | trimmed, non-empty, max 50 chars |
| `hour` | number | 0–23 integer |

Output: localized greeting string (`Good morning/afternoon/evening, {name}!`).

Rules:
- Empty/whitespace-only name → fallback greeting without name.
- Out-of-range `hour` → clamped to 0–23 range behavior documented in the logic
  test.

## 3. Frontend state shape

Minimal Zustand store (`src/stores/app-store.ts`) for the scaffold:

```
app-store {
  appName: string          // from validated env
  ui: { theme: 'light' }   // reserved, not yet used
}
```

No lifecycle transitions apply in this feature; the store is intentionally
minimal and will grow with future features.
