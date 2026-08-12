import { CheckCircle, EnvelopeSimple } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import type { SendStatus } from '../logic/types'

interface StepDoneProps {
  /** Number of orders emitted (one per supplier). */
  orderCount: number
  supplierNames: string[]
  /** Per-supplier notification outcome after emission. */
  sendStatus: Record<string, SendStatus>
  /** Called when the administrator closes the wizard. */
  onClose: () => void
}

/** Confirmation screen shown after the orders are emitted. */
export function StepDone({ orderCount, supplierNames, sendStatus, onClose }: StepDoneProps) {
  return (
    <div className="flex flex-col items-center gap-5 py-8 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-none bg-secondary/15">
        <CheckCircle size={28} weight="fill" className="text-secondary" />
      </div>

      <div>
        <h3 className="font-serif text-lg font-semibold text-foreground">
          {orderCount === 1 ? 'Orden emitida' : `${orderCount} órdenes emitidas`}
        </h3>
        <p className="mx-auto mt-2 max-w-xs text-xs leading-relaxed text-muted-foreground">
          Las órdenes han sido registradas. Cada proveedor recibirá un enlace temporal para acordar
          fecha de entrega y condiciones.
        </p>
      </div>

      <div className="w-full space-y-2 rounded-none border border-border bg-muted/30 p-4 text-left">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Estado del envío
        </p>
        {supplierNames.map((name) => {
          const ok = sendStatus[name] !== 'error'
          return (
            <div key={name} className="flex items-center gap-2.5 text-xs">
              <EnvelopeSimple
                size={14}
                weight="fill"
                className={`shrink-0 ${ok ? 'text-secondary' : 'text-destructive'}`}
              />
              <span className="font-medium text-foreground">{name}</span>
              <span className="ml-auto text-muted-foreground">
                {ok ? 'Notificación enviada' : 'Error de envío'}
              </span>
            </div>
          )
        })}
      </div>

      <Button onClick={onClose} variant="outline" size="sm">
        Volver a órdenes
      </Button>
    </div>
  )
}
