# Quickstart: Gestionar Proveedores

**Date**: 2026-09-11
**Feature**: [spec.md](./spec.md)

Runnable validation scenarios proving the module works end-to-end against the
in-memory mock (backed by [repository port](./contracts/proveedores-repository.md)
and [API contract](./contracts/proveedores-api.md)).
Data model: [data-model.md](./data-model.md).

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

Open `http://localhost:5173/proveedores`. The mock repository seeds ~25
suppliers, so the list shows page 1 of 3.

## Validation scenarios (map to spec acceptance)

| # | Scenario | Steps | Expected |
|---|----------|-------|----------|
| 1 | Listado paginado y columnas (US-1 E1) | Ver el módulo | Tabla con 10 filas, columnas Proveedor, RUC, Contacto, Ciudad, Registrado, Estado, Acciones |
| 2 | Búsqueda (US-1 E2) | Escribir "andina" en la búsqueda (debounced) | Solo filas coincidentes por nombre/RUC/contacto |
| 3 | Paginación (US-1 E3) | Ir a página 2 | Siguiente subconjunto; sin destello de carga en el cambio de página (`placeholderData`) |
| 4 | Alta con autocompletado fiscal (US-2 E1/E2) | "Nuevo Proveedor" → RUC de 11 dígitos de un seed | Razón Social/nombre comercial/dirección autocompletados; guardar → fila nueva "Activo" + notificación de éxito |
| 5 | Validación de formato (US-2 E3) | RUC inválido, email/teléfono incorrectos | Envío bloqueado; campos resaltados con mensajes ("Ingrese un RUC válido", "Email inválido", "Ingrese un teléfono válido") |
| 6 | RUC duplicado (US-2 E4) | Intentar guardar un RUC existente | Alerta bloqueante; no se guarda |
| 7 | Fallo de consulta fiscal (US-2 E5, Q3=B) | RUC de 11 dígitos no presente en el mock | Error con "Reintentar" y avance bloqueado hasta obtener datos fiscales |
| 8 | Edición (US-3) | "Editar" → cambiar contacto → guardar | Datos actualizados + éxito; lista refrescada |
| 9 | Desactivación con confirmación (US-4) | "Desactivar" → confirmar | Estado pasa a Inactivo; notificación; registro conservado (soft delete) |
| 10 | Cancelar desactivación (US-4 E3) | "Desactivar" → cancelar | Sin cambios |
| 11 | Reactivación (US-5, Q2=A) | sobre fila Inactiva → diálogo "Activar proveedor" → "Sí, activar" | Estado vuelve a Activo + notificación |
| 12 | Cancelar reactivación (US-5 E3) | diálogo → "Cancelar" | Sin cambios |
| 13 | Estados explícitos (FR-011) | Lista vacía vs. sin resultados por filtro vs. error | Cada caso muestra un estado diseñado (vacío con CTA / sin resultados / error con "Reintentar") |
| 14 | Restricción de rol (FR-013) | Simular sesión no-admin en el guard | Ruta no accesible para no-admin (guard del mock) |

## Failing the fiscal lookup on purpose (scenario 7)

The mock returns `DatosFiscales` only for seeded RUCs. To force the blocking
path, type an 11-digit RUC that is not part of the seed (not present in the
list) and attempt to continue — an error surfaces with a "Reintentar" action.

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
(Playwright/Chromium) and cover each component: table, filters, form dialog,
confirm dialog, estado badge, states, toast.

## CI

`.github/workflows/ci.yml` already runs lint, typecheck, logic tests, component
tests, and build on every PR into `main`. This feature adds no new jobs.

## Swap to the real backend (follow-up, FR-014)

Once the API exists, set `VITE_API_BASE_URL` in `.env.template`/`.env` and add
the HTTP adapter per [repository contract](./contracts/proveedores-repository.md);
the UI and its tests are unchanged.