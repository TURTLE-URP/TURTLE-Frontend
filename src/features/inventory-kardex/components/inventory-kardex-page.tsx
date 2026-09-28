import { useMemo, useState } from 'react'
import { KardexTable } from './kardex-table'
import { MovementDetailPanel } from './movement-detail-modal'
import { getMovementsForInsumo } from '../logic/kardex-selectors'
import { INSUMOS_FIXTURE } from '../fixtures/insumos.fixtures'
import { KARDEX_MOVEMENTS_FIXTURE } from '../fixtures/movimientos.fixtures'
import type { MovementType } from '../types'

/**
 * Top-level screen for "Inventario y Kardex": pick an insumo from the
 * searchable list on the left, review its movement history on the right,
 * and click a row to see the full detail of that Entrada/Salida/Merma.
 * All data comes from the fixtures module — there is no backend wired up.
 */
export function InventoryKardexPage() {
  const [selectedInsumoId, setSelectedInsumoId] = useState<string | null>(
    INSUMOS_FIXTURE[0]?.id ?? null,
  )
  const [selectedMovementId, setSelectedMovementId] = useState<string | null>(null)
  const [movementType, setMovementType] = useState<MovementType | 'todos'>('todos')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const selectedInsumo = useMemo(
    () => INSUMOS_FIXTURE.find((insumo) => insumo.id === selectedInsumoId) ?? null,
    [selectedInsumoId],
  )

  const movements = useMemo(
    () =>
      selectedInsumo
        ? getMovementsForInsumo(KARDEX_MOVEMENTS_FIXTURE, selectedInsumo.id, {
            tipo: movementType,
          }).filter((movement) => {
            const movementDate = movement.fecha.slice(0, 10)
            return (
              (!startDate || movementDate >= startDate) && (!endDate || movementDate <= endDate)
            )
          })
        : [],
    [selectedInsumo, movementType, startDate, endDate],
  )
  const selectedMovement =
    movements.find((movement) => movement.id === selectedMovementId) ?? movements[0] ?? null

  return (
    <section aria-labelledby="kardex-title" className="flex flex-col gap-4">
      <header>
        <p className="mb-1 text-xs font-semibold tracking-[0.16em] text-primary uppercase">
          TURTLE · Inventario
        </p>
        <h1 id="kardex-title" className="text-2xl font-semibold text-foreground">
          Kardex de almacén
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Historial de movimientos y trazabilidad de insumos.
        </p>
      </header>

      {selectedInsumo && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-slate-700">
          <span className="font-semibold text-slate-900">{selectedInsumo.nombre}</span>
          <span className="text-slate-400" aria-hidden="true">
            |
          </span>
          <span>{selectedInsumo.id.toUpperCase()}</span>
          <span className="text-slate-400" aria-hidden="true">
            |
          </span>
          <span>{selectedInsumo.categoria}</span>
          <span className="text-slate-400" aria-hidden="true">
            |
          </span>
          <span>
            Stock:{' '}
            <strong className="text-slate-900">
              {selectedInsumo.stockActual} {selectedInsumo.unidadMedida}
            </strong>
          </span>
          <span className="text-slate-400" aria-hidden="true">
            |
          </span>
          <span>{movements.length} movimientos en el periodo</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 rounded-lg border border-border bg-white p-3 md:grid-cols-[1fr_1fr_1.3fr_1fr]">
        <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
          Almacén
          <select
            className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground"
            defaultValue="central"
          >
            <option value="central">Cocina Central</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
          Insumo
          <select
            className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground"
            value={selectedInsumoId ?? ''}
            onChange={(event) => {
              setSelectedInsumoId(event.target.value)
              setSelectedMovementId(null)
            }}
          >
            {INSUMOS_FIXTURE.map((insumo) => (
              <option key={insumo.id} value={insumo.id}>
                {insumo.nombre} · {insumo.id.toUpperCase()}
              </option>
            ))}
          </select>
        </label>
        <div className="grid grid-cols-2 gap-2">
          <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
            Desde
            <input
              aria-label="Fecha inicial"
              className="h-10 min-w-0 rounded-md border border-input bg-background px-3 text-sm text-foreground"
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
            Hasta
            <input
              aria-label="Fecha final"
              className="h-10 min-w-0 rounded-md border border-input bg-background px-3 text-sm text-foreground"
              type="date"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
            />
          </label>
        </div>
        <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
          Tipo de movimiento
          <select
            className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground"
            value={movementType}
            onChange={(event) => setMovementType(event.target.value as MovementType | 'todos')}
          >
            <option value="todos">Todos los movimientos</option>
            <option value="entrada">Entrada</option>
            <option value="salida">Salida</option>
            <option value="merma">Merma</option>
          </select>
        </label>
      </div>

      <div className="grid min-h-0 grid-cols-1 gap-3 lg:min-h-[560px] lg:grid-cols-[1.6fr_1fr]">
        <section
          aria-label="Movimientos del insumo"
          className="flex min-h-96 flex-col rounded-xl border border-slate-300 bg-slate-50 p-4"
        >
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-slate-700">Movimientos</h2>
            <span className="text-xs text-muted-foreground">Fecha · tipo · cantidad · saldo</span>
          </div>
          {selectedInsumo ? (
            <KardexTable
              movements={movements}
              unidadMedida={selectedInsumo.unidadMedida}
              selectedMovementId={selectedMovement?.id ?? null}
              onSelectMovement={(movement) => setSelectedMovementId(movement.id)}
            />
          ) : (
            <p className="m-auto text-sm text-muted-foreground">
              Selecciona un insumo para consultar sus movimientos.
            </p>
          )}
        </section>

        {selectedInsumo && (
          <MovementDetailPanel
            movement={selectedMovement}
            insumoNombre={selectedInsumo.nombre}
            unidadMedida={selectedInsumo.unidadMedida}
          />
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        Inventario <span aria-hidden="true">›</span> Kardex
      </p>
    </section>
  )
}
