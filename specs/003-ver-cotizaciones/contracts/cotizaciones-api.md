# Contract: Cotizaciones API (HTTP)

**Feature**: Ver Cotizaciones | **Date**: 2026-09-27

Defines the HTTP contract for the quotations master view. The backend is **not
ready** (spec Q5=B); this contract is the source of truth that the frontend
programs against, and the deliverable the backend must implement. Today the same
shapes are served by the in-memory mock via the [repository port](./cotizaciones-repository.md).
Swapping the mock for an HTTP adapter must not change the UI.

Base URL: `VITE_API_BASE_URL` (currently empty → mock mode).

## Conventions

- JSON for requests and responses. mime `application/json`.
- Pagination is **1-based**: `?pagina=1&tamano=10`.
- `tamano` is fixed at 10 by the frontend (default), but the API must honor the
  parameter; clamp to a sane max (e.g. 100).
- Dates are ISO (`YYYY-MM-DD` for filters, ISO date-time for `fechaRegistro`-style fields).
- Errors use a single envelope (below); timeouts/network reuse the `kind: 'network'`
  shape via `src/lib/http/http.ts`.
- This feature is **read-only**: no mutation endpoints are required for it. The
  extended flows (Cerrar Cotización, Ver Orden de Compra, Ver Cotización detail)
  will add their own endpoints in follow-up specs.

## Endpoints

### GET `/cotizaciones` — listar con búsqueda, filtros y paginación

Query params: `texto` (opcional, trim; match parcial sobre `folio` y
`proveedorNombre` — FR-003), `estado` (opcional: `aprobada | en negociación |
rechazada`; ausente = todas — FR-004), `desde` / `hasta` (opcional,
ISO date, rango inclusivo sobre `fecha` — FR-004), `pagina` (≥1), `tamano`.

The server applies filtering and returns the matching page. Changing any of
`texto`/`estado`/`desde`/`hasta` restarts at `pagina=1` (client-enforced, FR-016).

200 response (ListadoCotizaciones):
```json
{
  "items": [
    {
      "id": "uuid",
      "folio": "COT-2026-001",
      "proveedorNombre": "Agro Andina",
      "fecha": "2026-09-20",
      "solicitudId": "uuid",
      "solicitudEstado": "en negociación",
      "total": 1250.5,
      "moneda": "PEN",
      "ordenCompraId": null
    }
  ],
  "pagina": 1,
  "tamano": 10,
  "total": 25,
  "totalPaginas": 3
}
```

## Error envelope

```json
{ "error": { "code": "VALIDACION" | "NO_ENCONTRADO" | "ERROR_INTERNO", "message": "<user-safe message>" } }
```

## Reference

Frontend consumes this contract only through the
[repository port](./cotizaciones-repository.md). Logic tests in this feature
cover filter/pagination mapping and the action-availability matrix once the
adapter lands.
