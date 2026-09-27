# Data Model: Ver Cotizaciones

**Date**: 2026-09-27
**Feature**: [spec.md](./spec.md)

Subset of the domain touched by this feature. The SPA holds no persistence;
the real source of truth is the backend (defined in
[contracts/cotizaciones-api.md](./contracts/cotizaciones-api.md)) and, for now,
the in-memory mock ([contracts/cotizaciones-repository.md](./contracts/cotizaciones-repository.md)).
Types below are the shared contract consumed by UI logic and tests.

## 1. Entidad Cotización

| Campo | Tipo | Validación / Reglas |
|-------|------|---------------------|
| `id` | string (uuid) | generado por la fuente; inmutable |
| `folio` | string | código identificador visible (p. ej. `COT-2026-001`); obligatorio, único entre cotizaciones |
| `proveedorNombre` | string | obligatorio, trim, 1–120 |
| `fecha` | string (ISO date) | fecha de la cotización; no editable aquí (vista de lectura) |
| `solicitudId` | string (uuid) | solicitud vinculada; inmutable aquí |
| `solicitudEstado` | `'aprobada' \| 'en negociación' \| 'rechazada'` | estado de la solicitud vinculada (los estados son de la solicitud, no de la cotización); determina acciones disponibles (§4) |
| `total` | number ≥ 0 | monto total, 2 decimales; solo lectura |
| `moneda` | string (ISO 4217, default `'PEN'`) | solo lectura |
| `ordenCompraId` | string (uuid) \| null | presente solo si existe OC derivada (típicamente con solicitud `aprobada`) |

Reglas transversales:
- Vista de solo lectura: este feature no muta cotizaciones (FR-015: ni siquiera
  expone creación).
- El `folio` es la clave de negocio para búsqueda (FR-003).
- Ciclo de vida: la solicitud nace en "borrador"; al enviarse nace la cotización,
  ya en "en negociación"; de ahí pasa a "aprobada" o "rechazada". El maestro
  solo contiene cotizaciones en esos tres estados (sesión 2026-09-27).

## 2. Filtros y envelope de paginación

`FiltrosCotizaciones`:
| Campo | Tipo | Reglas |
|-------|------|--------|
| `texto` | string (trim) | vacío = sin filtro; match parcial sobre `folio` y `proveedorNombre` (FR-003, sesión 2026-09-27) |
| `estado` | `'todas' \| SolicitudEstado` | default `'todas'`; filtra por `solicitudEstado` (FR-004) |
| `desde` | string (ISO date) \| null | inicio del rango sobre `fecha`; null = sin cota (FR-004) |
| `hasta` | string (ISO date) \| null | fin del rango sobre `fecha` (inclusivo); null = sin cota; `desde ≤ hasta` cuando ambos presentes |
| `pagina` | number ≥ 1 | página actual (1-based); retorna a 1 ante cualquier cambio de `texto`/`estado`/`desde`/`hasta` (FR-016) |
| `tamano` | 10 | fijo, default 10 (convención de 002) |

Envelope `ListadoCotizaciones` (respuesta):
```
{ items: Cotizacion[], pagina: number, tamano: number, total: number, totalPaginas: number }
```

## 3. Matriz de disponibilidad de acciones (§4 = FR-006, FR-009–FR-011)

| Acción | Habilitada cuando | En otro caso |
|--------|-------------------|--------------|
| `cerrar` (modal, FR-007) | `solicitudEstado === 'en negociación'` | deshabilitada + motivo "Disponible solo si la solicitud está en negociación" |
| `verOrden` (nueva pestaña, FR-008) | `solicitudEstado === 'aprobada'` | deshabilitada + motivo "Disponible solo si la solicitud está aprobada" |
| `verDetalle` (nueva pestaña, FR-009) | siempre | — (sin restricción) |

Los motivos los produce `logic/acciones.ts` (testeable en node), no la UI.

## 4. Formas de estado de UI (FR-012–FR-014, FR-016)

- **Cargando**: tabla con skeleton (`aria-busy`).
- **Error de carga**: mensaje + acción "Reintentar" (refetch).
- **Maestro vacío** (mensaje A): no hay cotizaciones registradas.
- **Sin resultados** (mensaje B): menciona el criterio de búsqueda/filtros usado.
- **Paginación**: anterior/siguiente deshabilitados en primera/última página.
