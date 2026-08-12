import { Check } from '@phosphor-icons/react'

interface WizardProgressProps {
  /** 1-based current step index (1 = Modalidad … 4 = Resumen). */
  step: number
}

const LABELS = ['Modalidad', 'Configurar', 'Asignar', 'Resumen'] as const

/** Linear step indicator aligned to the wizard's four main steps. */
export function WizardProgress({ step }: WizardProgressProps) {
  return (
    <div role="list" aria-label="Pasos del asistente" className="flex items-center justify-center gap-0">
      {LABELS.map((label, index) => {
        const number = index + 1
        const done = step > number
        const active = step === number
        return (
          <div key={label} role="listitem" aria-current={active ? 'step' : undefined} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-none text-xs font-semibold transition-colors duration-200 ${
                  done
                    ? 'bg-secondary text-secondary-foreground'
                    : active
                      ? 'bg-foreground text-background'
                      : 'bg-muted text-muted-foreground'
                }`}
              >
                {done ? <Check size={12} weight="bold" /> : number}
              </div>
              <span
                className={`whitespace-nowrap text-[10px] font-medium ${
                  active ? 'text-foreground' : done ? 'text-secondary' : 'text-muted-foreground'
                }`}
              >
                {label}
              </span>
            </div>
            {index < LABELS.length - 1 && (
              <div
                aria-hidden
                className={`mb-4 mx-1 h-px w-14 transition-colors duration-300 ${done ? 'bg-secondary' : 'bg-border'}`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
