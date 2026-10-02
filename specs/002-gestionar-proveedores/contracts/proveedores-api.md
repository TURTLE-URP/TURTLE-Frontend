# Contract: Proveedores API (HTTP)

**Feature**: Gestionar Proveedores | **Date**: 2026-09-11

Defines the HTTP contract for the supplier module. The backend is **not ready**
(Q1=B); this contract is the source of truth that the frontend programs
against, and the deliverable the backend must implement. Today the same shapes
are served by the in-memory mock via the [repository port](./proveedores-repository.md).
Swapping the mock for an HTTP adapter must not change the UI.

Base URL: `VITE_API_BASE_URL` (currently empty → mock mode).

## Conventions

- JSON for requests and responses. mime `application/json`.
- Pagination is **1-based**: `?pagina=1&tamano=10`.
- `tamano` is fixed at 10 by the frontend (default), but the API must honor the
  parameter; clamp to a sane max (e.g. 100).
- RUC/NIT is validated as exactly 11 numeric digits.
- Errors use a single envelope (below); timeouts/network reuse the `kind: 'network'`
  shape via `src/lib/http/http.ts`.
- All supplier mutations are soft-delete based: the provider stays in the
  dataset with `estado: 'Inactivo'` (FR-010, SC-004).

## Endpoints

### GET `/proveedores` — listar con búsqueda y paginación

Query params: `texto` (opcional, trim; match parcial sobre nombre comercial,
RUC y contacto — FR-002), `pagina` (≥1), `tamano`.

200 response (ListadoProveedores):
```json
{
  "items": [
    {
      "id": "uuid",
      "nombreComercial": "Agro Andina",
      "ruc": "20123456789",
      "razonSocial": "Agro Andina S.A.C.",
      "contactoNombre": "María López",
      "contactoTelefono": "+51 999 888 777",
      "contactoEmail": "maria@agroandina.pe",
      "direccion": "Av. Industrial 120",
      "ciudad": "Arequipa",
      "fechaRegistro": "2026-09-01T10:15:00Z",
      "estado": "Activo"
    }
  ],
  "pagina": 1,
  "tamano": 10,
  "total": 25,
  "totalPaginas": 3
}
```

### GET `/proveedores/fiscales/:ruc` — autocompletar datos fiscales

`:ruc` = 11 dígitos. 200 response (DatosFiscales):
```json
{ "razonSocial": "Agro Andina S.A.C.", "nombreComercial": "Agro Andina", "direccion": "Av. Industrial 120" }
```
- `404` (no encontrado) o `5xx`/timeout → la UI bloquea el registro con error
  + reintentar (FR-005, Q3=B).

### POST `/proveedores` — registrar

Body: `{ nombreComercial, ruc, razonSocial, contactoNombre, contactoTelefono,
contactoEmail, direccion, ciudad }` (sin `id`, `fechaRegistro` ni `estado`).
- `201` → Proveedor creado (estado `Activo`, `fechaRegistro` asignada por el servidor).
- `409` → RUC duplicado (FR-007): bloqueante.
- `422` → validación de formato fallida (RUC 11 dígitos, email, teléfono — FR-006).

### PUT `/proveedores/:id` — actualizar

Body: mismo shape que POST (RUC incluido; validación de duplicidad excluye el
propio id). `200` → Proveedor actualizado. `409`/`422` como arriba.

### PATCH `/proveedores/:id/estado` — desactivar / reactivar

Body: `{ "estado": "Inactivo" | "Activo" }` (solo esta transición es válida:
Activo↔Inactivo).
- `200` → Proveedor con el estado actualizado.
- `409`/`400` → transición no permitida o estado inválido.
- La acción siempre se confirma primero en la UI (FR-009/FR-015).

## Error envelope

```json
{ "error": { "code": "RUC_DUPLICADO" | "VALIDACION" | "NO_ENCONTRADO" | "TRANSICION_INVALIDA" | "ERROR_INTERNO", "message": "<user-safe message>" } }
```

## Reference

Frontend consumes this contract only through the
[repository port](./proveedores-repository.md). Logic tests in this feature
cover the mapping between HTTP errors (`HttpError.kind`/`status`) and the
envelope codes above once the adapter lands.