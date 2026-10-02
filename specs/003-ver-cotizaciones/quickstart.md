# Quickstart: Ver Cotizaciones

**Date**: 2026-09-27
**Feature**: [spec.md](./spec.md)

Runnable validation scenarios proving the master view works end-to-end against
the in-memory mock (backed by [repository port](./contracts/cotizaciones-repository.md)
and [API contract](./contracts/cotizaciones-api.md)).
Data model: [data-model.md](./data-model.md). Research: [research.md](./research.md).

## Prerequisites

- Node.js 24 LTS (`.nvmrc`; `nvm use` if needed).
- npm (package manager of record).
- For component tests: Playwright browsers (`npx playwright install chromium`).

## Setup

```sh
npm ci   # installs from lockfile
```

**Expected**: clean install; `npm run audit` shows no high/critical.

## Run the app

```sh
npm run dev   # http://localhost:5173
```

Open `http://localhost:5173/catalogos/cotizaciones`. The mock repository seeds ~25
quotations, so the list shows page 1 of 3.

## Validation scenarios (map to spec acceptance)

| # | Scenario | Steps | Expected |
|---|----------|-------|----------|
| 1 | Listado y columnas (US-1 E1) | Ver el módulo | Tabla con 10 filas, columnas folio, proveedor, fecha, estado, total/monto y acciones |
| 2 | Búsqueda por texto (US-1 E2) | Escribir un folio o proveedor en la búsqueda (debounced) | Solo filas coincidentes |
| 3 | Filtros (US-1 E3) | Filtrar por estado y por rango de fechas | Solo filas que cumplen; la página retorna a 1 |
| 4 | Paginación (US-1 E4, FR-016) | Ir a página 2; observar primera/última | Siguiente subconjunto sin destello (`placeholderData`); anterior/siguiente deshabilitados en los bordes |
| 5 | Cerrar habilitado (US-2 E1) | Fila con solicitud "en negociación" → cerrar | Se abre el modal (shell) de inicio de cierre |
| 6 | Ver OC habilitado (US-2 E2) | Fila con solicitud "aprobada" → ver Orden de Compra | Se abre nueva pestaña con el detalle de la OC (ruta destino: follow-up) |
| 7 | Ver detalles siempre (US-2 E3) | Cualquier fila → ver detalles | Nueva pestaña con el detalle (ruta destino: follow-up) |
| 8 | Acción no disponible (US-2 E4/E5) | Fila sin estado requerido | Acción deshabilitada con explicación visible del motivo |
| 9 | Sin botón global (FR-015) | Inspeccionar la vista | No existe ningún botón ni enlace de creación |
| 10 | Maestro vacío (FR-013a) | Mock sin datos | Mensaje de maestro vacío |
| 11 | Sin resultados (FR-013b) | Búsqueda/filtros sin coincidencias | Mensaje que menciona el criterio usado |
| 12 | Error con reintento (FR-014) | Forzar fallo del mock | Mensaje de error + "Reintentar" |
| 13 | Restricción de rol (FR-001) | Simular sesión no-admin en el guard | Ruta no accesible para no-admin |

## Quality gates

```sh
npm run lint              # ESLint: zero errors
npm run typecheck         # tsc -b: zero errors
npm test                  # logic tests (node env): all pass
npm run test:components   # component tests (Vitest Browser Mode): all pass
npm run build             # production build: zero TypeScript errors
npm run audit             # no high/critical vulnerabilities
```

**Expected**: every command exits 0. Component tests run in a real browser
(Playwright/Chromium) and cover each component: table, filters, pagination,
row actions, estado badge, states.

## CI

`.github/workflows/ci.yml` already runs lint, typecheck, logic tests, component
tests, and build on every PR into `main`. This feature adds no new jobs.

## Swap to the real backend (follow-up)

Once the API exists, set `VITE_API_BASE_URL` in `.env.template`/`.env` and add
the HTTP adapter per [repository contract](./contracts/cotizaciones-repository.md);
the UI and its tests are unchanged.
