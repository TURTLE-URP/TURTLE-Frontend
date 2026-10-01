import { PrinterIcon } from '@phosphor-icons/react'
import { Button } from '@/shared/components/ui/button'
import { formatMovementDate, formatMovementTime } from '../lib/format-date'
import { movementTypeLabel } from '../lib/movement-type'
import type { KardexMovement } from '../interfaces/types'

export interface MovementDetailPanelProps {
  movement: KardexMovement | null
  insumoNombre: string
  unidadMedida: string
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[11px] font-medium text-slate-500">{label}</span>
      <div className="min-h-10 rounded-md border border-amber-200 bg-white px-3 py-2 text-sm text-slate-800">
        {value}
      </div>
    </div>
  )
}

/** Persistent read-only detail for the currently selected Kardex movement. */
export function MovementDetailPanel({
  movement,
  insumoNombre,
  unidadMedida,
}: MovementDetailPanelProps) {
  const balanceBefore = movement
    ? movement.tipo === 'entrada'
      ? movement.saldoResultante - movement.cantidad
      : movement.saldoResultante + movement.cantidad
    : null

  return (
    <aside
      aria-label="Detalle del movimiento seleccionado"
      className="flex min-h-96 flex-col rounded-xl border border-amber-300 bg-amber-50 p-4"
    >
      <div className="mb-4">
        <h2 className="text-base font-semibold text-amber-800">
          Detalle del movimiento
          {movement ? ` · ${movementTypeLabel(movement.tipo).toUpperCase()}` : ''}
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">Solo lectura · trazabilidad completa</p>
      </div>

      {movement && balanceBefore !== null ? (
        <div className="flex flex-1 flex-col gap-2.5">
          <DetailField
            label="Fecha / hora"
            value={`${formatMovementDate(movement.fecha)} ${formatMovementTime(movement.fecha)}`}
          />
          <DetailField
            label="Tipo / cantidad"
            value={`${movementTypeLabel(movement.tipo).toUpperCase()} · ${movement.tipo === 'entrada' ? '+' : '-'}${movement.cantidad} ${unidadMedida}`}
          />
          <DetailField
            label="Saldo anterior → nuevo"
            value={`${balanceBefore} ${unidadMedida} → ${movement.saldoResultante} ${unidadMedida}`}
          />
          <DetailField label="Insumo" value={insumoNombre} />
          <DetailField label="Documento / comprobante" value={movement.documento} />
          <DetailField label="Motivo" value={movement.motivo} />
          <DetailField label="Responsable" value={movement.responsable} />
          <div className="mt-auto pt-2">
            <Button type="button" onClick={() => window.print()} className="w-full sm:w-auto">
              <PrinterIcon aria-hidden="true" />
              Exportar PDF
            </Button>
          </div>
        </div>
      ) : (
        <p className="m-auto max-w-xs text-center text-sm text-muted-foreground">
          Selecciona un movimiento para consultar su detalle.
        </p>
      )}
    </aside>
  )
}
