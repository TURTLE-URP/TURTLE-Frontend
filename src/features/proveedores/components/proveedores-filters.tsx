import { MagnifyingGlass } from '@phosphor-icons/react'
import { Input } from '@/components/ui/input'

interface ProveedoresFiltersProps {
  texto: string
  onTextoChange: (texto: string) => void
  total: number
}

export function ProveedoresFilters({ texto, onTextoChange, total }: ProveedoresFiltersProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="relative w-full max-w-sm">
        <MagnifyingGlass
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          id="buscar-proveedor"
          type="search"
          placeholder="Buscar por nombre, RUC, contacto..."
          value={texto}
          onChange={(event) => onTextoChange(event.target.value)}
          className="pl-8"
        />
      </div>
      <p aria-live="polite" className="text-sm text-muted-foreground">
        {total === 1 ? '1 proveedor' : `${total} proveedores`}
      </p>
    </div>
  )
}