import { formatMovementDate, formatMovementTime } from '../lib/format-date'
import { movementTypeLabel } from '../lib/movement-type'
import type { KardexMovement } from '../interfaces/types'
import { CheckIcon } from '@phosphor-icons/react'

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
    <ul className="flex flex-col gap-1.5 overflow-y-auto pr-1">
      {movements.map((movement) => {
        const isSelected = movement.id === selectedMovementId
        const balanceBefore =
          movement.tipo === 'entrada'
            ? movement.saldoResultante - movement.cantidad
            : movement.saldoResultante + movement.cantidad

        // Colores base y seleccionado por tipo
        const styles = {
          entrada: {
            base: 'border-emerald-200 bg-emerald-50 hover:bg-emerald-100/70 hover:border-emerald-300',
            selected: 'border-l-emerald-500 bg-emerald-100 border-emerald-300',
            check: 'bg-emerald-500 text-white',
            text: 'text-emerald-800',
          },
          salida: {
            base: 'border-amber-200 bg-amber-50 hover:bg-amber-100/70 hover:border-amber-300',
            selected: 'border-l-amber-500 bg-amber-100 border-amber-300',
            check: 'bg-amber-500 text-white',
            text: 'text-amber-800',
          },
          merma: {
            base: 'border-rose-200 bg-rose-50 hover:bg-rose-100/70 hover:border-rose-300',
            selected: 'border-l-rose-500 bg-rose-100 border-rose-300',
            check: 'bg-rose-500 text-white',
            text: 'text-rose-800',
          },
        }[movement.tipo]

        return (
          <li key={movement.id}>
            <button
              type="button"
              aria-pressed={isSelected}
              aria-label={`Ver detalle: ${movementTypeLabel(movement.tipo)}, ${movement.cantidad} ${unidadMedida}, ${formatMovementDate(movement.fecha)}`}
              onClick={() => onSelectMovement(movement)}
              className={`
                w-full rounded-xl border text-left transition-all duration-150
                focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary
                ${isSelected
                  ? `border-l-4 px-3 py-3 ${styles.selected}`
                  : `px-3 py-3 ${styles.base}`
                }
              `}
            >
              <span className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold text-slate-800">
                {/* Checkmark cuando está seleccionado */}
                {isSelected && (
                  <span className={`inline-flex items-center justify-center rounded-full w-4 h-4 ${styles.check}`}>
                    <CheckIcon size={10} weight="bold" />
                  </span>
                )}
                <span>{formatMovementDate(movement.fecha)} {formatMovementTime(movement.fecha)}</span>
                <span className={isSelected ? styles.text : ''}>{movementTypeLabel(movement.tipo).toUpperCase()}</span>
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
