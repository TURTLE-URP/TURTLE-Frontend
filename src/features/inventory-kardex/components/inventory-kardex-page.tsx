import { useMemo, useState } from 'react'
import { InsumoList } from './insumo-list'
import { KardexTable } from './kardex-table'
import { MovementDetailModal } from './movement-detail-modal'
import { filterInsumos, getMovementsForInsumo } from '../logic/kardex-selectors'
import { INSUMOS_FIXTURE } from '../fixtures/insumos.fixtures'
import { KARDEX_MOVEMENTS_FIXTURE } from '../fixtures/movimientos.fixtures'
import type { KardexMovement } from '../types'

/**
 * Top-level screen for "Inventario y Kardex": pick an insumo from the
 * searchable list on the left, review its movement history on the right,
 * and click a row to see the full detail of that Entrada/Salida/Merma.
 * All data comes from the fixtures module — there is no backend wired up.
 */
export function InventoryKardexPage() {
  const [insumoQuery, setInsumoQuery] = useState('')
  const [selectedInsumoId, setSelectedInsumoId] = useState<string | null>(
    INSUMOS_FIXTURE[0]?.id ?? null,
  )
  const [selectedMovement, setSelectedMovement] = useState<KardexMovement | null>(null)

  const filteredInsumos = useMemo(() => filterInsumos(INSUMOS_FIXTURE, insumoQuery), [insumoQuery])

  const selectedInsumo = useMemo(
    () => INSUMOS_FIXTURE.find((insumo) => insumo.id === selectedInsumoId) ?? null,
    [selectedInsumoId],
  )

  const movements = useMemo(
    () =>
      selectedInsumo ? getMovementsForInsumo(KARDEX_MOVEMENTS_FIXTURE, selectedInsumo.id) : [],
    [selectedInsumo],
  )

  return (
    <section aria-labelledby="kardex-title" className="flex flex-col gap-6">
      <div>
        <h1 id="kardex-title" className="text-2xl font-bold text-foreground">
          Inventario y Kardex
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Consulta el historial de movimientos de cada insumo: entradas, salidas y mermas.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[280px_1fr]">
        <InsumoList
          insumos={filteredInsumos}
          selectedId={selectedInsumoId}
          onSelect={(insumo) => setSelectedInsumoId(insumo.id)}
          query={insumoQuery}
          onQueryChange={setInsumoQuery}
        />

        <div className="flex flex-col gap-3">
          {selectedInsumo ? (
            <>
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border pb-3">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">{selectedInsumo.nombre}</h2>
                  <p className="text-xs text-muted-foreground">{selectedInsumo.categoria}</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Stock actual:{' '}
                  <span className="font-semibold text-foreground">
                    {selectedInsumo.stockActual} {selectedInsumo.unidadMedida}
                  </span>
                </p>
              </div>

              <KardexTable
                movements={movements}
                unidadMedida={selectedInsumo.unidadMedida}
                onSelectMovement={setSelectedMovement}
              />
            </>
          ) : (
            <div className="rounded-none border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
              Selecciona un insumo de la lista para ver su Kardex.
            </div>
          )}
        </div>
      </div>

      <MovementDetailModal
        open={selectedMovement !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedMovement(null)
        }}
        movement={selectedMovement}
        insumoNombre={selectedInsumo?.nombre ?? ''}
        unidadMedida={selectedInsumo?.unidadMedida ?? ''}
      />
    </section>
  )
}
