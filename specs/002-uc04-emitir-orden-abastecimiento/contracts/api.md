# Contract: CUS04 API Boundary

**Feature**: Emitir Orden de Abastecimiento (CUS04) | **Date**: 2026-08-09

Defines the frontend's data-access boundary for CUS04: endpoints,
request/response shapes (pseudotypes), the DTO↔domain mapping and validation
policy, and the mock→real migration path. Source of truth for **FR-014** and
the resolved assumptions (no backend in this iteration; the backend
calculates).

## Scope & rules

- Data access lives in `logic/api/`; components consume TanStack Query hooks
  only (never raw `fetch`).
- Base URL: `VITE_API_BASE_URL`. Client is native `fetch` (no axios). No new
  third-party dependencies.
- All shapes below are **pseudotypes**. The concrete DTO interfaces are
  created in `logic/api/dtos.ts` during implementation and MUST validate
  against this contract. When the real JSON schemas arrive, this document is
  the validation target (see migration checklist).

## Endpoint catalog

### `GET /supply-orders`

Returns the history: single orders and logical groups (emitted in one start
of supply). Filtering/search are client-side today (FR-003); the query params
are reserved for the future backend.

- Query params (reserved): `?status=` `?q=`
- Response (pseudotype):

```ts
type Response = HistoryEntry[]          // domain: single orders + groups
```

### `GET /supply-orders/kpis`

Module KPIs (FR-002).

- Response (pseudotype):

```ts
type Response = {
  ordersMonth: number
  pendingAgreements: number
  spendPeriod: number
  shortageIngredients: number
}
```

### `GET /catalog`

Reference bundle: internal ingredients, dishes (with recipes) and supplier
products with equivalences. May be split into dedicated endpoints later; this
contract fixes the response shape.

- Response (pseudotype):

```ts
type Response = {
  ingredients: Ingredient[]          // domain types from logic/types.ts
  dishes: Dish[]
  supplierProducts: SupplierProduct[]
}
```

### `POST /supply-orders/calculate`

Computes the order items per modality. **The backend calculates**
(assumption resolved 2026-08-09): the frontend sends the modality
configuration and receives typed items. Free modality sends manual
quantities and receives the normalized items.

- Request body (union by modality):

```ts
type Request =
  | { modality: 'platillos'; dishQtys: Record<dishId, number> }
  | { modality: 'escasez' }
  | { modality: 'libre'; quantities: Record<ingredientId, number> }
```

- Response (pseudotype):

```ts
type Response = OrderItem[]          // items without product assignment yet
```

### `POST /supply-orders/emit`

Registers one order per supplier (related in a logical group) and returns the
notification result per supplier. The order is always registered even when a
send fails.

- Request body (pseudotype):

```ts
type Request = {
  items: OrderItem[]                 // selectedProduct already resolved
  modality?: Modality                // optional; used by the mock's deterministic sendStatus
}
```

- Response (pseudotype):

```ts
type Response = {
  orders: SingleOrder[]
  sendStatus: Record<supplierId, 'sent' | 'error'>
}
```

## Error contract

- Every non-2xx response is normalized to `ApiError { status: number;
  message: string }` in the client layer.
- Loading / error / empty are surfaced through the hooks (FR-008).

## DTO ↔ domain mapping & validation (Principle IV)

- The API layer returns raw DTOs (`XxxDto`). The real backend is expected to
  use `snake_case`; the mock uses `camelCase`. Normalization is documented
  here and handled by the mappers.
- Mappers (`fromXxxDto` + hand-written **type guards**) validate and convert
  DTOs into domain types from `logic/types.ts`.
- Components only ever see domain types.
- Validation failure is treated like a failed request (hook error state). No
  `zod` without prior consultation (Principle I).

## Mock ↔ endpoint migration table

| Mock (`logic/api/mock.ts`)              | Endpoint                  | Notes                          |
| --------------------------------------- | ------------------------- | ------------------------------ |
| `calculateDishItems(dishQtys)`          | `POST /supply-orders/calculate` | body `modality: 'platillos'` |
| `calculateShortageItems(ingredients = INGREDIENTS)` | `POST /supply-orders/calculate` | body `modality: 'escasez'`   |
| `buildFreeItems(quantities)`            | `POST /supply-orders/calculate` | body `modality: 'libre'`     |
| `emitOrders(items, { modality })`       | `POST /supply-orders/emit`      | deterministic per-supplier sendStatus |
| catalog seed (`data.ts` → fixtures)     | `GET /catalog`             |                                |
| order history (`ORDER_HISTORY`)         | `GET /supply-orders`       |                                |
| KPI seed                                | `GET /supply-orders/kpis`  |                                |

## Migration checklist (when the real JSON schemas arrive)

1. Point the client at the real backend (`VITE_API_BASE_URL`); translate the
   JSON Schema into DTO types in `logic/api/dtos.ts`.
2. Adjust/extend the mappers and type guards; keep domain types unchanged.
3. Swap `api/mock.ts` for `api/http.ts` behind the **same** hook signatures.
   Hooks and components do not change.
4. Keep fixtures only under `logic/__fixtures__/` for tests; remove mock
   imports from production paths.
5. Re-run logic + component tests. If the real schemas contradict this
   contract, update this document and the spec with a new clarification
   session.
