import { ArrowRight, ChartBar, ForkKnife, NotePencil } from '@phosphor-icons/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { modalitySchema } from './step-modality.form'
import type { Modality } from '../logic/types'
import type { ModalityFormValues } from './step-modality.form'

interface StepModalityProps {
  /** Called when the administrator selects a modality. */
  onSelect: (modality: Modality) => void
  /** Previously selected modality, restored when returning to this step. */
  initialModality?: Modality | null
}

const OPTIONS: {
  key: Modality
  Icon: typeof ForkKnife
  title: string
  desc: string
  detail: string
}[] = [
  {
    key: 'platillos',
    Icon: ForkKnife,
    title: 'Por platillos',
    desc: 'Selecciona platillos y cantidades. El sistema calcula los insumos según las recetas registradas.',
    detail: 'Ideal para planificar el abasto según la producción esperada.',
  },
  {
    key: 'escasez',
    Icon: ChartBar,
    title: 'Por escasez',
    desc: 'El sistema detecta insumos por debajo del stock deseado y calcula las cantidades faltantes.',
    detail: 'Recomendado para reponer el inventario al nivel óptimo.',
  },
  {
    key: 'libre',
    Icon: NotePencil,
    title: 'Abasto libre',
    desc: 'Selecciona manualmente los insumos y las cantidades que deseas solicitar.',
    detail: 'Para pedidos específicos o extraordinarios fuera del ciclo habitual.',
  },
]

/** Step 1 of the wizard — select the supply modality. */
export function StepModality({ onSelect, initialModality }: StepModalityProps) {
  const { setValue, trigger } = useForm<ModalityFormValues>({
    resolver: zodResolver(modalitySchema),
    mode: 'onChange',
    defaultValues: { modality: initialModality ?? undefined },
  })

  function handleSelect(modality: Modality) {
    void setValue('modality', modality, { shouldValidate: true })
    void trigger('modality')
    onSelect(modality)
  }

  return (
    <div className="space-y-3">
      <div className="mb-5">
        <h3 className="text-base font-semibold text-foreground">Selecciona la modalidad de abasto</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Se generará una orden independiente por cada proveedor involucrado.
        </p>
      </div>

      <div className="grid gap-2.5">
        {OPTIONS.map(({ key, Icon, title, desc, detail }) => (
          <button
            key={key}
            type="button"
            onClick={() => handleSelect(key)}
            className="group w-full rounded-none border border-border bg-card p-4 text-left transition-all duration-150 hover:border-primary focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-none bg-muted transition-colors group-hover:bg-primary/10">
                <Icon
                  size={18}
                  className="text-muted-foreground transition-colors group-hover:text-primary"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-foreground">{title}</span>
                  <ArrowRight
                    size={14}
                    className="shrink-0 text-muted-foreground transition-colors group-hover:text-primary"
                  />
                </div>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{desc}</p>
                <p className="mt-1 text-[11px] text-muted-foreground/70">{detail}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
