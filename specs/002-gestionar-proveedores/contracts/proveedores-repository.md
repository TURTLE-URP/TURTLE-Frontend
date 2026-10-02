# Contract: Proveedores Repository (data access port)

**Feature**: Gestionar Proveedores | **Date**: 2026-09-11

Defines the single seam through which the UI accesses supplier data. The
frontend MUST NOT call `fetch`/HTTP directly from components; it uses this port
(FR-014). Today the only implementation is the in-memory mock; an HTTP adapter
implementing the same interface replaces it when the backend lands
([API contract](./proveedores-api.md)).

## Port interface

```ts
interface ProveedoresRepository {
  listar(filtros: FiltrosProveedores): Promise<ListadoProveedores>
  getDatosFiscales(ruc: string): Promise<DatosFiscales>      // throw si no existe
  crear(input: ProveedorInput): Promise<Proveedor>            // throw si RUC duplicado
  actualizar(id: string, input: ProveedorInput): Promise<Proveedor>
  cambiarEstado(id: string, estado: 'Activo' | 'Inactivo'): Promise<Proveedor>
}
```

Shared types come from [data-model.md](../data-model.md).

## Error semantics

- `listar` throws on load failure (network/service) → UI "error state" + retry (FR-011).
- `getDatosFiscales` throws on 404/no-data or transport error → register blocked
  with error + "Reintentar" (FR-005, Q3=B). Note: a *valid RUC with no data*
  is treated as an error, matching the user decision.
- `crear`/`actualizar` throw a `RucDuplicadoError` on 409 → UI blocking alert (FR-007).
- Errors map to the [API envelope](./proveedores-api.md) codes; the future HTTP
  adapter derives them from `HttpError.kind`/`status` (`src/lib/http/http.ts`).

## Mock implementation (`mock-proveedores-repository.ts`)

Purpose: exercise the full UI and acceptance scenarios without a backend.

- **Seed**: ~25 suppliers with realistic Peruvian data (varied names, RUCs,
  contacts, cities, a mix of Activo/Inactivo) so pagination (3 pages at 10/size)
  and search are meaningfully testable.
- **Latency**: simulated 300–700ms delay so loading states render.
- **Search**: case-insensitive partial match over `nombreComercial`, `ruc`,
  `contactoNombre` (FR-002).
- **Uniqueness**: in-memory `ruc` uniqueness on create/update → throws
  `RucDuplicadoError` (FR-007).
- **Fiscal lookup**: returns canned `DatosFiscales` for seed RUCs; throws for
  unknown ones (drives the FR-005 blocking path). Test-only escape hatch
  documented in tests, never reachable from UI.
- **State**: mutates an in-memory array; consistent within the session.

## Testing

- Logic tests (`node` env) cover `listar` pagination/search, uniqueness,
  state transitions, and fiscal miss→throw using the mock directly.
- Port shape is asserted so the future HTTP adapter compiles against the same
  interface.

## Swap-in steps for the HTTP adapter (follow-up, FR-014)

1. Implement `HttpProveedoresRepository implements ProveedoresRepository`
   using `request()` from `src/lib/http/http.ts` and the envelope codes above.
2. Wire the factory `createProveedoresRepository()`:
   `VITE_API_BASE_URL` set → HTTP adapter; otherwise → mock.
3. No UI or port changes required.