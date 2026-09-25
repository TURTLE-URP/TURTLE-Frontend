import type { ReactNode } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { MovementTypeBadge } from './movement-type-badge'
import { formatMovementDate, formatMovementTime } from '../logic/format-date'
import type { KardexMovement } from '../types'

export interface MovementDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  movement: KardexMovement | null
  insumoNombre: string
  unidadMedida: string
}

function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border py-2.5 last:border-b-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  )
}

/** Full detail of a single Kardex movement, opened by clicking its table row. */
export function MovementDetailModal({
  open,
  onOpenChange,
  movement,
  insumoNombre,
  unidadMedida,
}: MovementDetailModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detalle del movimiento</DialogTitle>
          <DialogDescription>{insumoNombre}</DialogDescription>
        </DialogHeader>

        {movement && (
          <div className="flex flex-col">
            <DetailRow label="Tipo" value={<MovementTypeBadge type={movement.tipo} />} />
            <DetailRow label="Cantidad" value={`${movement.cantidad} ${unidadMedida}`} />
            <DetailRow
              label="Fecha y hora"
              value={`${formatMovementDate(movement.fecha)} · ${formatMovementTime(movement.fecha)}`}
            />
            <DetailRow label="Responsable" value={movement.responsable} />
            <DetailRow label="Documento" value={movement.documento} />
            <DetailRow
              label="Motivo"
              value={<span className="text-right">{movement.motivo}</span>}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
