# Eliminar insumo — Modal `InsumoDeleteDialog`

Modal de confirmación para eliminar un insumo. Hace todo solo contra el
backend con TanStack Query: pide el resumen, evalúa los 3 criterios y
ejecuta el borrado lógico. La tabla que lo usa solo abre/cierra el modal.

## Lo que hace solo

| Acción                                                         | Endpoint                        |
| -------------------------------------------------------------- | ------------------------------- |
| Header (`código • nombre • stock total unidad en N almacenes`) | `GET /supplies/{id}`            |
| Lista de 3 criterios (✓/✗ + detalle)                           | `GET /supplies/{id}/eliminable` |
| Botón **Eliminar** (habilitado solo si pasan los 3 criterios)  | `DELETE /supplies/{id}`         |

Además muestra toasts de éxito/error e invalida las queries
`['insumos']` y `['supplies']` para que la tabla se refresque sola.

## Requisitos

- `VITE_API_BASE_URL` apuntando al backend (ej. `http://localhost:3000`).
- Backend arriba y, si exige auth, sesión iniciada (el token se adjunta solo).

## Cómo importarlo desde tu rama

Tu rama ya tiene la tabla + botón "Eliminar insumo". Solo necesitas traer
este componente y conectarlo (los cambios ya están subidos al remoto):

```bash
git fetch origin
# opción A: mergear la rama donde vive el modal
git merge origin/detalles-eliminar-insumos
# opción B: si ya está en main
git merge origin/main
```

Luego, en tu página/tabla:

```tsx
import { useState } from 'react'
import { InsumoDeleteDialog } from '@/features/eliminar-insumo/components/insumo-delete-dialog'
import type { InsumoAEliminar } from '@/features/eliminar-insumo/logic/types'

const [insumoAEliminar, setInsumoAEliminar] = useState<InsumoAEliminar | null>(null)

// En tu tabla, el botón Eliminar de cada fila llama:
//   onClick={() => setInsumoAEliminar({ id: fila.id, codigo: fila.codigo, nombre: fila.nombre })}

<InsumoDeleteDialog
  open={!!insumoAEliminar}
  insumo={insumoAEliminar}
  onOpenChange={(open) => {
    if (!open) setInsumoAEliminar(null)
  }}
  onConfirmar={() => setInsumoAEliminar(null)} // el DELETE + toast ya van dentro
/>;
```

## Props

| Prop           | Tipo                      | Requerida              | Descripción                                                                                                                                                             |
| -------------- | ------------------------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `open`         | `boolean`                 | sí                     | Abre/cierra el modal.                                                                                                                                                   |
| `insumo`       | `{ id, codigo, nombre }`  | no (default `id: '1'`) | Solo el `id` se usa para los requests; `codigo`/`nombre` pintan el header al instante (luego los pisa el `GET`). Tu tipo `Insumo` sirve directo si tiene esos 3 campos. |
| `onOpenChange` | `(open: boolean) => void` | sí                     | Limpia tu `useState` al cerrar.                                                                                                                                         |
| `onConfirmar`  | `() => void`              | sí                     | Se llama tras eliminar con éxito (normalmente cerrar/limpiar). No borres nada aquí: el `DELETE` ya lo hizo el modal.                                                    |

## Ejemplo vivo

`http://localhost:5173/preview/eliminar-insumo` (página temporal de prueba).

## Si algo falla

| Síntoma                               | Causa probable                                                                         |
| ------------------------------------- | -------------------------------------------------------------------------------------- |
| "No se pudo evaluar este insumo"      | Backend abajo o `GET /supplies/{id}/eliminable` en `404` (revisar Network → Response). |
| Header con `0 en 0 almacenes`         | `GET /supplies/{id}` falló; se muestran los datos de la prop como respaldo.            |
| Toast "No se pudo eliminar el insumo" | Falló el `DELETE`; revisa Network → método `DELETE` a `/supplies/{id}` y su Response.  |
