# Contract: Cotizaciones Repository (port)

**Feature**: Ver Cotizaciones | **Date**: 2026-09-27

The repository **port** the UI programs against. Two adapters implement it: the
in-memory mock (shipped with this feature) and the future HTTP adapter (built
on [cotizaciones-api.md](./cotizaciones-api.md) once the backend exists).
Swapping adapters must not change UI code or component tests.

## Port interface (TypeScript)

```ts
import type { Cotizacion, FiltrosCotizaciones, ListadoCotizaciones } from '../types';

export interface CotizacionesRepository {
  /** Paginated, filtered master list. Never throws for empty results (returns empty items). */
  listar(filtros: FiltrosCotizaciones): Promise<ListadoCotizaciones>;
}
```

## Adapter rules

- **Mock** (`mock-cotizaciones-repository.ts`): seeds ~25 quotations covering all
  `solicitudEstado` values (so every availability-matrix branch is reachable);
  simulated latency 300–700ms; honors `texto` (folio + proveedorNombre, partial,
  case-insensitive), `estado`, `desde`/`hasta`, and 1-based pagination; rejects
  on demand (flag) to exercise the error state.
- **HTTP** (follow-up): maps query params 1:1 to `GET /cotizaciones`; maps the
  error envelope to thrown errors with user-safe messages; timeouts surface as
  the `network` kind for the "Reintentar" path.

## Test coverage

- Port semantics (filtering, pagination math, empty-vs-error distinction) are
  covered by node logic tests against the mock.
- Component tests consume the port through the same TanStack Query hooks as
  production code — no test-only data paths.
