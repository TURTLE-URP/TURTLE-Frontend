# Data Model: CUS04 — Emitir Orden de Abastecimiento

**Branch**: `feature/implement-UC04` | **Date**: 2026-08-09 | **Spec**: [spec.md](./spec.md)

Domain model for the supply-orders feature, extracted from the spec entities
and the prototype types (`dump/CUS04/src/features/supply-orders/logic/types.ts`).
All types live in `logic/types.ts`; DTOs and mappers live in `logic/api/`
(see [contracts/api.md](./contracts/api.md)).

## Types

### Union types

```ts
type OrderStatus = 'Emitida' | 'Pendiente' | 'Acordada' | 'Entregada' | 'Error'
type Modality = 'platillos' | 'escasez' | 'libre'
type WizardStep = 'modality' | 'configure' | 'assign' | 'summary' | 'done'
type SendStatus = 'sent' | 'error'
type Role = 'admin' | 'staff'          // stub, replaced by real auth
```

### Entities

**Ingredient** — internal inventory item.
`id: string; name: string; unit: string; currentStock: number; desiredStock: number; category: string`
- Validation: `currentStock >= 0`, `desiredStock >= 0`.

**Dish** — menu item with its recipe.
`id: string; name: string; ingredients: { ingredientId: string; qty: number }[]`
- Validation: `qty > 0` per recipe line; `ingredientId` references an `Ingredient`.

**SupplierProduct** — supplier's product equivalent to an internal ingredient.
`id: string; name: string; supplierId: string; supplierName: string; contact: string; unit: string; unitCost: number; ingredientId: string`
- Validation: `unitCost >= 0`.

**OrderItem** — an ingredient required by the order, with optional product assignment.
`ingredient: Ingredient; qty: number; selectedProduct?: SupplierProduct`
- Validation: `qty > 0` to continue; assignment completeness is a gate for
  the confirm step.

**SingleOrder** — one supply order directed at one supplier.
`id: string; supplier: string; date: string; status: OrderStatus; total: number; products: number`

**OrderGroup** — logical group of orders emitted in one start of supply.
`groupId: string; date: string; modality: string; orders: SingleOrder[]`

**HistoryEntry** — `OrderGroup | SingleOrder`, discriminated by `groupId`.
- `isGroup(entry): entry is OrderGroup`.

**ApiError** — normalized error from the client layer.
`{ status: number; message: string }` (produced by `src/lib/http` → mapped in `logic/api/client.ts`).

## Relationships

```
OrderItem.ingredient        -> Ingredient              (required)
OrderItem.selectedProduct   -> SupplierProduct         (optional, required to confirm)
SupplierProduct.ingredientId-> Ingredient              (equivalence link)
OrderGroup.orders           -> SingleOrder[]           (one per supplier, same start of supply)
HistoryEntry                = OrderGroup | SingleOrder
```

## State transitions

### Order lifecycle
```
Emitida ─────────────► Acordada ────► Entregada
   │
   └─(send failed)──► Pendiente  (registered but notification pending/error)
```

### Wizard flow (FR-004)
```
modality ─► configure ─► assign ─► summary ─► done
```
- `modality → configure`: always enabled.
- `configure → assign`: at least one quantity > 0 (platillos/escasez/libre).
- `assign → summary`: every item has `selectedProduct` (no unassignable item).
- `summary → done`: mutation `emitOrders` registers orders; `sendStatus`
  per supplier shown in done step.
- Closing the wizard at any point discards the selection (nothing registered).

## Calculation rules (backend calculates — mock simulates, `contracts/api.md`)

- **Por platillos**: `qty(ingredient) = Σ platillos(cantidad × proporciónReceta)`,
  rounded to 1 decimal; dishes with quantity ≤ 0 are skipped.
- **Por escasez**: only ingredients with `currentStock < desiredStock`;
  `qty = desiredStock - currentStock`.
- **Abasto libre**: manual quantities per ingredient (step 0.5).
- **Agrupación por proveedor** (client, pure): group by `selectedProduct.supplierId`;
  per-supplier `subtotal = Σ unitCost × qty`, grand total = Σ subtotals.
- **Moneda**: `Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' })`.

## Data sources

- Fixtures (mock + tests) live in `logic/__fixtures__/`, derived from the
  prototype `data.ts` (`INGREDIENTS`, `DISHES`, `SUPPLIER_PRODUCTS`,
  `ORDER_HISTORY`). Never imported into production components directly.
