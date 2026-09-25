import { MovementTypeBadge } from './movement-type-badge'
import { formatMovementDate, formatMovementTime } from '../logic/format-date'
import type { KardexMovement } from '../types'

export interface KardexTableProps {
  movements: KardexMovement[]
  unidadMedida: string
  onSelectMovement: (movement: KardexMovement) => void
}

/**
 * Renders the movement history for one insumo. Each row is clickable and
 * opens the full detail of that movement (see MovementDetailModal).
 */
export function KardexTable({ movements, unidadMedida, onSelectMovement }: KardexTableProps) {
  if (movements.length === 0) {
    return (
      <div className="rounded-none border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
        Este insumo todavía no registra movimientos.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-none border border-border">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50 text-xs text-muted-foreground uppercase">
            <th scope="col" className="px-4 py-2.5 font-medium">
              Fecha y hora
            </th>
            <th scope="col" className="px-4 py-2.5 font-medium">
              Tipo
            </th>
            <th scope="col" className="px-4 py-2.5 font-medium">
              Cantidad
            </th>
            <th scope="col" className="px-4 py-2.5 font-medium">
              Motivo
            </th>
          </tr>
        </thead>
        <tbody>
          {movements.map((movement) => (
            <tr
              key={movement.id}
              tabIndex={0}
              role="button"
              aria-label={`Ver detalle del movimiento del ${formatMovementDate(movement.fecha)}`}
              onClick={() => onSelectMovement(movement)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  onSelectMovement(movement)
                }
              }}
              className="cursor-pointer border-b border-border last:border-b-0 hover:bg-muted/30 focus-visible:bg-muted/30 focus-visible:outline-none"
            >
              <td className="px-4 py-3 text-muted-foreground">
                <span className="text-foreground">{formatMovementDate(movement.fecha)}</span>
                {' · '}
                {formatMovementTime(movement.fecha)}
              </td>
              <td className="px-4 py-3">
                <MovementTypeBadge type={movement.tipo} />
              </td>
              <td className="px-4 py-3 font-medium text-foreground">
                {movement.cantidad} {unidadMedida}
              </td>
              <td className="px-4 py-3 max-w-xs truncate text-muted-foreground">
                {movement.motivo}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
