# Data Model: Gestionar Proveedores

**Date**: 2026-09-11
**Feature**: [spec.md](./spec.md)

Subset of the domain touched by this feature. The SPA holds no persistence;
the real source of truth is the backend (defined in
[contracts/proveedores-api.md](./contracts/proveedores-api.md)) and, for now,
the in-memory mock ([contracts/proveedores-repository.md](./contracts/proveedores-repository.md)).
Types below are the shared contract consumed by UI logic and tests.

## 1. Entidad Proveedor

| Campo | Tipo | Validación / Reglas |
|-------|------|---------------------|
| `id` | string (uuid) | generado por la fuente; inmutable |
| `nombreComercial` | string | obligatorio (FR-006), trim, 1–120 |
| `ruc` | string | obligatorio, **11 dígitos numéricos**, único entre proveedores (FR-006, FR-007) |
| `razonSocial` | string | obligatorio, trim, 1–200; autocompletado por consulta fiscal (FR-005) |
| `contactoNombre` | string | obligatorio, trim, 1–120 |
| `contactoTelefono` | string | obligatorio, formato teléfono válido (FR-006) |
| `contactoEmail` | string | obligatorio, formato email válido (FR-006) |
| `direccion` | string | obligatorio, trim, 1–250; autocompletado por consulta fiscal |
| `ciudad` | string | obligatorio, trim, 1–100 |
| `fechaRegistro` | string (ISO date-time) | fijada en el alta; no editable en edición |
| `estado` | `'Activo' \| 'Inactivo'` | transición controlada (ver §4) |

Reglas transversales:
- Soft delete only: nunca se elimina físicamente (FR-010, SC-004).
- El RUC es la clave de negocio para duplicidad: alta y edición lanzan error de
  duplicado si otro proveedor activo o inactivo lo posee (FR-007, FR-008).
- La desactivación/re activación no altera el resto de campos.

## 2. DatosFiscales (autocompletado por RUC/NIT)

| Campo | Tipo | Reglas |
|-------|------|--------|
| `razonSocial` | string | a partir de RUC válido (11 dígitos) |
| `nombreComercial` | string | a partir de RUC válido |
| `direccion` | string | a partir de RUC válido |

- Si la consulta falla o no encuentra el RUC → error bloqueante con opción de
  reintentar; el registro no puede continuar hasta obtener datos (FR-005, Q3=B).

## 3. Filtros y envelope de paginación

`FiltrosProveedores`:
| Campo | Tipo | Reglas |
|-------|------|--------|
| `texto` | string (trim) | vacío = sin filtro; se aplica sobre nombre comercial, RUC y contacto (FR-002) |
| `pagina` | number ≥ 1 | página actual (1-based) |
| `tamano` | 10 | fijo, default 10 (spec assumption) |

Envelope `ListadoProveedores` (respuesta):
```
{ items: Proveedor[], pagina: number, tamano: number, total: number, totalPaginas: number }
```

## 4. Transiciones de estado

```
                    desactivar (confirm)
         ┌──────────────────────────────────┐
         │                                  ▼
   (alta)                                  ┌──────────┐
    └────► Activo ─────────────────────────►│          │
             ▲                              │ Inactivo │
             │   reactivar (confirm)        │          │
             └──────────────────────────────│          │
                                            └──────────┘
```

- El alta crea siempre el proveedor en estado **Activo** (US-2).
- `Activo → Inactivo`: acción "Desactivar" con confirmación explícita
  (FR-009/FR-010, US-4). Soft delete; conserva datos e historial.
- `Inactivo → Activo`: acción "Sí, activar" en el diálogo "Activar proveedor"
  (FR-015, US-5, Q2=A).
- Cualquiera de las dos acciones debe notificar éxito y refrescar la lista
  (FR-012).

## 5. Formas de estado de UI (FR-011)

- **Cargando**: tabla con skeleton (`aria-busy`).
- **Error de carga**: mensaje + acción "Reintentar" (refetch).
- **Vacío (sin datos)**: mensaje + CTA para registrar el primer proveedor.
- **Sin resultados por filtro**: mensaje + sugerencia de ajustar la búsqueda.