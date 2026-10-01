import { formatMovementDate, formatMovementTime } from '../lib/format-date'
import { movementTypeLabel } from '../lib/movement-type'
import type { KardexMovement } from '../interfaces/types'

export interface KardexTableProps {
  movements: KardexMovement[]
  unidadMedida: string
  selectedMovementId: string | null
  onSelectMovement: (movement: KardexMovement) => void
}

/**
 * Renders the movement history for one insumo. Each row is clickable and
 * updates the persistent detail panel for that movement.
 */
export function KardexTable({
  movements,
  unidadMedida,
  selectedMovementId,
  onSelectMovement,
}: KardexTableProps) {
  if (movements.length === 0) {
    return (
      <div className="m-auto rounded-lg border border-dashed border-slate-300 px-8 py-10 text-center text-sm text-muted-foreground">
        No hay movimientos para los filtros seleccionados.
      </div>
    )
  }

  return (
    <ul className="flex flex-col gap-2 overflow-y-auto pr-1">
      {movements.map((movement) => {
        const isSelected = movement.id === selectedMovementId
        const balanceBefore =
          movement.tipo === 'entrada'
            ? movement.saldoResultante - movement.cantidad
            : movement.saldoResultante + movement.cantidad
        const tone = {
          entrada: 'border-green-200 bg-green-50 hover:border-green-300',
          salida: 'border-amber-300 bg-orange-50 hover:border-amber-400',
          merma: 'border-rose-300 bg-rose-50 hover:border-rose-400',
        }[movement.tipo]

        return (
          <li key={movement.id}>
            <button
              type="button"
              aria-pressed={isSelected}
              aria-label={`Ver detalle: ${movementTypeLabel(movement.tipo)}, ${movement.cantidad} ${unidadMedida}, ${formatMovementDate(movement.fecha)}`}
              onClick={() => onSelectMovement(movement)}
              className={`w-full rounded-xl border px-3 py-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${tone} ${isSelected ? 'border-slate-800 ring-1 ring-slate-800' : ''}`}
            >
              <span className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold text-slate-800">
                {isSelected && <span className="uppercase">Seleccionado</span>}
                <span>
                  {formatMovementDate(movement.fecha)} {formatMovementTime(movement.fecha)}
                </span>
                <span>{movementTypeLabel(movement.tipo).toUpperCase()}</span>
                <span>
                  {movement.tipo === 'entrada' ? '+' : '-'}
                  {movement.cantidad} {unidadMedida}
                </span>
                <span className="font-normal text-slate-600">
                  {balanceBefore} → {movement.saldoResultante} {unidadMedida}
                </span>
              </span>
              <span className="mt-1 block truncate text-xs text-slate-500">
                {movement.motivo} · {movement.documento}
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
