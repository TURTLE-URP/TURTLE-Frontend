import { MagnifyingGlass, Plus } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface ProveedoresFiltersProps {
  texto: string
  onTextoChange: (texto: string) => void
  onNuevo: () => void
}

export function ProveedoresFilters({
  texto,
  onTextoChange,
  onNuevo,
}: ProveedoresFiltersProps) {
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
      <div className="flex items-center gap-4">
        <Button type="button" onClick={onNuevo} className="bg-blue-700 text-white hover:bg-blue-800">
          <Plus aria-hidden="true" />
          Nuevo Proveedor
        </Button>
      </div>
    </div>
  )
}