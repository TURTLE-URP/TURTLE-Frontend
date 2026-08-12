# Quickstart: CUS04 — Emitir Orden de Abastecimiento

**Branch**: `feature/implement-UC04` | **Date**: 2026-08-09 | **Spec**: [spec.md](./spec.md)

Runnable validation guide for the feature. This proves the feature works
end-to-end; implementation details live in `tasks.md` and the contracts
([components.md](./contracts/components.md), [api.md](./contracts/api.md)).

## Prerequisites

- Node 24 (`.nvmrc`), npm. Install: `npm install` (includes the
  form-validation stack: zod, react-hook-form, @hookform/resolvers).
- `cp .env.template .env` (defaults are fine; `VITE_API_BASE_URL` is optional
  and unused by the mock).
- Generate the shadcn primitives once: `npx shadcn add dialog radio-group
  badge table input label`.

## Scenario 1 — Historial y KPIs (US1)

```bash
npm run dev
# open http://localhost:5173/abastecimiento
```

1. The page renders KPIs (órdenes del mes, pendientes, gasto, insumos en
   escasez) and the orders table with single rows and expandable groups.
2. Expand/collapse a group **with the keyboard** (focus + Enter on the expand
   control); rows appear for each supplier.
3. Filter by status and search by supplier/ID; an explicit empty state
   appears when there are no matches.
4. With network-less mock: confirm loading → data (or loading/error states
   when the query rejects).

## Scenario 2 — Emitir por abasto libre (US2, MVP)

1. Click **Emitir orden(es)** → the wizard modal opens (Radix Dialog).
2. Choose **Abasto libre** → enter quantities for ≥ 1 ingredient (Continuar
   disabled until then).
3. Assign a supplier product per ingredient (Radios). Confirm remains disabled
   while any item is unassigned.
4. Summary groups by supplier with per-supplier and grand totals (es-PE).
5. Confirm → the done step shows the emitted orders and the per-supplier
   `sendStatus`; the history table reflects the new orders after closing.

## Scenario 3 — Abasto por escasez / por platillos (US3, US4)

- **Escasez**: ingredients under desired stock are listed with
  `qty = desiredStock - currentStock`; if none, the empty state blocks
  Continue.
- **Platillos**: set a quantity on ≥ 1 dish; the calculated items aggregate
  `cantidad × proporción` per ingredient; with no quantity, Continue is
  disabled.

## Scenario 4 — Guard de ruta (US5)

- With `getCurrentRole()` = `'staff'`, visiting `/abastecimiento` redirects
  to `/` (assert via route test). With `'admin'`, the route renders.

## Automated validation

```bash
npm run lint
npm run typecheck
npm run test          # logic tests (node): calculations, mappers, guards
npm run test:components  # component tests (Vitest Browser Mode)
npm run build         # production build must pass with zero TS errors
```

## Expected outcomes

- All gates above pass with no `any`, `!`, hardcoded palette colors, or
  `console.log` in the feature code (SC-004).
- WCAG 2.1 AA checks for dialog, radio groups, expandable rows, and
  text+color badges (SC-005).
