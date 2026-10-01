import type { MedidaAlterna } from '../interfaces/insumo.types'

interface Props {
  medida: MedidaAlterna | null
}

export function VistaPreviaUso({ medida }: Props) {
  return (
    <section>
      <h2 className="text-sm font-semibold text-foreground mb-2">Vista previa de uso</h2>
      <div className="rounded-xl border border-dashed border-border bg-card/50 p-6 min-h-35 flex items-center justify-center text-center">
        {medida ? (
          <p className="text-sm text-foreground">
            1 <span className="font-semibold">{medida.nombre}</span> es equivalente a{' '}
            <span className="font-semibold">{medida.factorABase}</span> kilogramos
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Selecciona una medida de la tabla para ver su equivalencia
          </p>
        )}
      </div>
    </section>
  )
}
