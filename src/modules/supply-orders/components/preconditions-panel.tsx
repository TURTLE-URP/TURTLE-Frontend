import { CheckCircleIcon } from '@phosphor-icons/react'

const preconditions = [
  'Insumos internos registrados con stock deseado',
  'Relaciones de equivalencia insumo ↔ producto',
  'Proveedores con catálogos y medios de contacto',
  'Recetas registradas para abasto por platillos',
]

export function PreconditionsPanel() {
  return (
    <div className="rounded-xl border border-border bg-muted/20 p-4">
      <p className="mb-3 text-xs font-medium uppercase text-muted-foreground">
        Precondiciones del sistema
      </p>
      <div className="grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
        {preconditions.map((item) => (
          <div key={item} className="flex items-center gap-2 text-sm text-foreground">
            <CheckCircleIcon size={16} className="shrink-0 text-green-600" />
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}