import { useMemo, useState } from 'react'
import {
  CaretLeftIcon,
  CaretRightIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  DropIcon,
} from '@phosphor-icons/react'
import { KardexTable } from './kardex-table'
import { MovementDetailPanel } from './movement-detail-modal'
import { getMovementsForInsumo } from '../logic/kardex-selectors'
import { INSUMOS_FIXTURE } from '../fixtures/insumos.fixtures'
import { KARDEX_MOVEMENTS_FIXTURE } from '../fixtures/movimientos.fixtures'
import type { MovementType } from '../types'

export function InventoryKardexPage() {
  const [selectedInsumoId, setSelectedInsumoId] = useState<string | null>(
    INSUMOS_FIXTURE[0]?.id ?? null,
  )
  const [selectedMovementId, setSelectedMovementId] = useState<string | null>(null)
  const [movementType, setMovementType] = useState<MovementType | 'todos'>('todos')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [paginaActual, setPaginaActual] = useState(1)

  const ITEMS_POR_PAGINA = 8

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

  const totalPaginas = Math.ceil(movements.length / ITEMS_POR_PAGINA) || 1
  const movementsPaginados = movements.slice(
    (paginaActual - 1) * ITEMS_POR_PAGINA,
    paginaActual * ITEMS_POR_PAGINA,
  )

  const selectedMovement =
    movementsPaginados.find((movement) => movement.id === selectedMovementId) ??
    movementsPaginados[0] ??
    null

  // KPIs derivados de todos los movimientos del insumo (sin filtro)
  const allMovements = useMemo(
    () =>
      selectedInsumo
        ? getMovementsForInsumo(KARDEX_MOVEMENTS_FIXTURE, selectedInsumo.id, { tipo: 'todos' })
        : [],
    [selectedInsumo],
  )
  const kpiEntradas = allMovements.filter((m) => m.tipo === 'entrada').length
  const kpiSalidas = allMovements.filter((m) => m.tipo === 'salida').length
  const kpiMermas = allMovements.filter((m) => m.tipo === 'merma').length

  return (
    <section aria-labelledby="kardex-title" className="flex flex-col gap-6">

      {/* HEADER */}
      <div>
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          MÓDULO · Inventario
        </span>
        <h1 id="kardex-title" className="text-2xl font-bold text-foreground">
          Kardex de Almacén
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Historial de movimientos y trazabilidad de insumos
        </p>
      </div>



      {/* BARRA DE FILTROS */}
      <div className="rounded-xl border border-border bg-card shadow-xs p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_1.3fr_1fr]">
          <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
            Almacén
            <div className="relative">
              <select
                className="h-9 w-full appearance-none rounded-md border border-gray-200 bg-white pl-3 pr-8 text-sm text-foreground shadow-xs outline-none transition-colors hover:border-gray-400 focus:border-ring focus:ring-1 focus:ring-ring"
                defaultValue="central"
              >
                <option value="central">Cocina Central</option>
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-muted-foreground">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
            </div>
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
            Insumo
            <div className="relative">
              <select
                className="h-9 w-full appearance-none rounded-md border border-gray-200 bg-white pl-3 pr-8 text-sm text-foreground shadow-xs outline-none transition-colors hover:border-gray-400 focus:border-ring focus:ring-1 focus:ring-ring"
                value={selectedInsumoId ?? ''}
                onChange={(event) => {
                  setSelectedInsumoId(event.target.value)
                  setSelectedMovementId(null)
                  setPaginaActual(1)
                }}
              >
                {INSUMOS_FIXTURE.map((insumo) => (
                  <option key={insumo.id} value={insumo.id}>
                    {insumo.nombre}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-muted-foreground">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
            </div>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
              Desde
              <input
                aria-label="Fecha inicial"
                className="h-9 min-w-0 rounded-md border border-gray-200 bg-white px-3 text-sm text-foreground shadow-xs outline-none transition-colors hover:border-gray-400 focus:ring-1 focus:ring-ring focus:border-ring"
                type="date"
                value={startDate}
                onChange={(event) => { setStartDate(event.target.value); setPaginaActual(1) }}
              />
            </label>
            <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
              Hasta
              <input
                aria-label="Fecha final"
                className="h-9 min-w-0 rounded-md border border-gray-200 bg-white px-3 text-sm text-foreground shadow-xs outline-none transition-colors hover:border-gray-400 focus:ring-1 focus:ring-ring focus:border-ring"
                type="date"
                value={endDate}
                onChange={(event) => { setEndDate(event.target.value); setPaginaActual(1) }}
              />
            </label>
          </div>
          <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
            Tipo de movimiento
            <div className="relative">
              <select
                className="h-9 w-full appearance-none rounded-md border border-gray-200 bg-white pl-3 pr-8 text-sm text-foreground shadow-xs outline-none transition-colors hover:border-gray-400 focus:border-ring focus:ring-1 focus:ring-ring"
                value={movementType}
                onChange={(event) => {
                  setMovementType(event.target.value as MovementType | 'todos')
                  setPaginaActual(1)
                }}
              >
                <option value="todos">Todos los movimientos</option>
                <option value="entrada">Entrada</option>
                <option value="salida">Salida</option>
                <option value="merma">Merma</option>
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-muted-foreground">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
            </div>
          </label>
        </div>


        {/* Insumo info + KPI chips */}
        {selectedInsumo && (
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-muted/40 px-4 py-2.5">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
              <span className="font-semibold text-foreground">{selectedInsumo.nombre}</span>
              <span className="text-muted-foreground" aria-hidden="true">·</span>
              <span className="text-xs text-muted-foreground font-mono">{selectedInsumo.id.toUpperCase()}</span>
              <span className="text-muted-foreground" aria-hidden="true">·</span>
              <span className="text-xs text-muted-foreground">{selectedInsumo.categoria}</span>
              <span className="text-muted-foreground" aria-hidden="true">·</span>
              <span className="text-xs">
                Stock: <strong className="text-foreground">{selectedInsumo.stockActual} {selectedInsumo.unidadMedida}</strong>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1">
                <ArrowDownIcon size={12} className="text-emerald-600" />
                <span className="text-[11px] font-medium text-emerald-700">Entradas</span>
                <span className="text-sm font-bold text-emerald-600 leading-none">{kpiEntradas}</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1">
                <ArrowUpIcon size={12} className="text-amber-600" />
                <span className="text-[11px] font-medium text-amber-700">Salidas</span>
                <span className="text-sm font-bold text-amber-600 leading-none">{kpiSalidas}</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-md border border-rose-200 bg-rose-50 px-2.5 py-1">
                <DropIcon size={12} className="text-rose-600" />
                <span className="text-[11px] font-medium text-rose-700">Mermas</span>
                <span className="text-sm font-bold text-rose-600 leading-none">{kpiMermas}</span>
              </div>
            </div>
          </div>
        )}
      </div>


      {/* CONTENIDO PRINCIPAL: tabla + detalle */}
      <div className="grid min-h-0 grid-cols-1 gap-4 lg:min-h-[560px] lg:grid-cols-[1.6fr_1fr]">

        {/* PANEL MOVIMIENTOS */}
        <div className="border border-border bg-card shadow-xs overflow-hidden rounded-xl">
          <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
            <h2 className="text-sm font-semibold text-foreground">Movimientos</h2>
            <span className="text-xs text-muted-foreground">Fecha · tipo · cantidad · saldo</span>
          </div>
          <div className="p-4 flex flex-col gap-3">
            {selectedInsumo ? (
              <>
                <KardexTable
                  movements={movementsPaginados}
                  unidadMedida={selectedInsumo.unidadMedida}
                  selectedMovementId={selectedMovement?.id ?? null}
                  onSelectMovement={(movement) => setSelectedMovementId(movement.id)}
                />
                {/* PAGINACIÓN */}
                {totalPaginas > 1 && (
                  <div className="flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
                    <span>
                      Mostrando{' '}
                      {movements.length === 0
                        ? 0
                        : (paginaActual - 1) * ITEMS_POR_PAGINA + 1}{' '}
                      a{' '}
                      {Math.min(paginaActual * ITEMS_POR_PAGINA, movements.length)}{' '}
                      de {movements.length} resultados
                    </span>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => setPaginaActual((p) => Math.max(p - 1, 1))}
                        disabled={paginaActual === 1}
                        className="p-1.5 rounded-md border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        aria-label="Página anterior"
                      >
                        <CaretLeftIcon size={16} />
                      </button>
                      <span className="font-medium text-foreground">
                        Página {paginaActual} de {totalPaginas}
                      </span>
                      <button
                        type="button"
                        onClick={() => setPaginaActual((p) => Math.min(p + 1, totalPaginas))}
                        disabled={paginaActual === totalPaginas}
                        className="p-1.5 rounded-md border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        aria-label="Página siguiente"
                      >
                        <CaretRightIcon size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className="m-auto text-sm text-muted-foreground py-12">
                Selecciona un insumo para consultar sus movimientos.
              </p>
            )}
          </div>
        </div>

        {/* PANEL DETALLE */}
        {selectedInsumo && (
          <MovementDetailPanel
            movement={selectedMovement}
            insumoNombre={selectedInsumo.nombre}
            unidadMedida={selectedInsumo.unidadMedida}
          />
        )}
      </div>
    </section>
  )
}
