import { useState } from 'react'
import { X } from '@phosphor-icons/react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useEmitOrders } from '../logic/api/hooks'
import { groupBySupplier } from '../logic/calculations'
import { WizardProgress } from './wizard-progress'
import { StepModality } from './step-modality'
import { StepConfigure } from './step-configure'
import { StepAssign } from './step-assign'
import { StepSummary } from './step-summary'
import { StepDone } from './step-done'
import type { Modality, OrderItem, SendStatus, WizardStep } from '../logic/types'

interface WizardModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const MODALITY_LABELS: Record<Modality, string> = {
  platillos: 'Por platillos',
  escasez: 'Por escasez',
  libre: 'Abasto libre',
}

const STEP_INDEX: Record<WizardStep, number> = {
  modality: 1,
  configure: 2,
  assign: 3,
  summary: 4,
  done: 5,
}

/** Full-wizard modal for emitting a supply order (CUS04). */
export function WizardModal({ open, onOpenChange }: WizardModalProps) {
  const emitOrders = useEmitOrders()
  const [step, setStep] = useState<WizardStep>('modality')
  const [modality, setModality] = useState<Modality | null>(null)
  const [items, setItems] = useState<OrderItem[]>([])
  const [doneOrderCount, setDoneOrderCount] = useState(0)
  const [doneSuppliers, setDoneSuppliers] = useState<string[]>([])
  const [doneSendStatus, setDoneSendStatus] = useState<Record<string, SendStatus>>({})
  const [sending, setSending] = useState(false)
  const [emitError, setEmitError] = useState<string | null>(null)

  function handleOpenChange(next: boolean) {
    if (!next) {
      setStep('modality')
      setModality(null)
      setItems([])
      setDoneOrderCount(0)
      setDoneSuppliers([])
      setDoneSendStatus({})
      setEmitError(null)
    }
    onOpenChange(next)
  }

  function handleSelectModality(selected: Modality) {
    setModality(selected)
    setStep('configure')
  }

  function handleConfigure(configured: OrderItem[]) {
    setItems(configured)
    setStep('assign')
  }

  function handleBack() {
    if (step === 'configure') {
      setStep('modality')
    } else if (step === 'assign') {
      setStep('configure')
    } else if (step === 'summary') {
      setStep('assign')
    }
  }

  async function handleConfirm() {
    if (sending || items.length === 0) {
      return
    }
    setSending(true)
    setEmitError(null)
    try {
      const result = await emitOrders.mutateAsync({ items, modality: modality ?? 'libre' })
      const groups = groupBySupplier(items)
      const statusByName: Record<string, SendStatus> = Object.fromEntries(
        groups.map((group) => [
          group.supplierName,
          result.sendStatus[group.supplierId] ?? 'sent',
        ]),
      )
      setDoneOrderCount(result.orders.length)
      setDoneSuppliers(groups.map((group) => group.supplierName))
      setDoneSendStatus(statusByName)
      setStep('done')
    } catch {
      setEmitError('No se pudieron emitir las órdenes. Inténtalo de nuevo.')
    } finally {
      setSending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-border px-6 py-4">
          <div>
            <DialogTitle className="text-sm font-semibold text-foreground">
              Emitir Orden de Abastecimiento
            </DialogTitle>
            <DialogDescription className="mt-0.5 text-xs">
              {modality && step !== 'done'
                ? MODALITY_LABELS[modality]
                : 'Se creará una orden por proveedor.'}
            </DialogDescription>
          </div>
          <DialogClose asChild>
            <Button variant="ghost" size="icon-sm" aria-label="Cerrar">
              <X size={16} />
            </Button>
          </DialogClose>
        </div>

        {step !== 'done' && (
          <div className="shrink-0 border-b border-border bg-muted/20 px-6 py-3">
            <WizardProgress step={STEP_INDEX[step]} />
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {step === 'modality' && (
            <StepModality onSelect={handleSelectModality} initialModality={modality} />
          )}
          {step === 'configure' && modality && (
            <StepConfigure modality={modality} onNext={handleConfigure} />
          )}
          {step === 'assign' && (
            <StepAssign items={items} onUpdate={setItems} onNext={() => setStep('summary')} />
          )}
          {step === 'summary' && (
            <StepSummary items={items} onConfirm={handleConfirm} confirming={sending} />
          )}
          {step === 'done' && (
            <StepDone
              orderCount={doneOrderCount}
              supplierNames={doneSuppliers}
              sendStatus={doneSendStatus}
              onClose={() => handleOpenChange(false)}
            />
          )}
          {emitError && step !== 'done' && (
            <p role="alert" className="mt-4 text-xs text-destructive">
              {emitError}
            </p>
          )}
        </div>

        {(step === 'configure' || step === 'assign' || step === 'summary') && (
          <div className="flex shrink-0 items-center justify-between border-t border-border bg-muted/20 px-6 py-3">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              ← Atrás
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
