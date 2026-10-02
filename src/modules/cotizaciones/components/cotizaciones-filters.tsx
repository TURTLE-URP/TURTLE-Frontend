import { MagnifyingGlass } from '@phosphor-icons/react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import type { FiltroEstado } from '../interfaces/types'

interface CotizacionesFiltersProps {
  texto: string
  onTextoChange: (texto: string) => void
  estado: FiltroEstado
  onEstadoChange: (estado: FiltroEstado) => void
  desde: string | null
  onDesdeChange: (fecha: string | null) => void
  hasta: string | null
  onHastaChange: (fecha: string | null) => void
  onLimpiar: () => void
}

const ESTADOS: FiltroEstado[] = ['todas', 'aprobada', 'en negociación', 'rechazada']

export function CotizacionesFilters({
  texto,
  onTextoChange,
  estado,
  onEstadoChange,
  desde,
  onDesdeChange,
  hasta,
  onHastaChange,
  onLimpiar,
}: CotizacionesFiltersProps) {
  return (
    <div className="flex flex-wrap items-end gap-4">
      <div className="relative w-full max-w-sm space-y-1.5">
        <Label htmlFor="buscar-cotizacion">Buscar</Label>
        <div className="relative">
          <MagnifyingGlass
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            id="buscar-cotizacion"
            type="search"
            placeholder="Buscar por folio o proveedor…"
            value={texto}
            onChange={(event) => onTextoChange(event.target.value)}
            className="pl-8"
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="filtro-estado">Estado</Label>
        <select
          id="filtro-estado"
          value={estado}
          onChange={(event) => onEstadoChange(event.target.value as FiltroEstado)}
          className="border-input bg-background h-9 rounded-md border px-3 text-sm"
        >
          {ESTADOS.map((opcion) => (
            <option key={opcion} value={opcion}>
              {opcion === 'todas' ? 'Todos' : opcion}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="filtro-desde">Desde</Label>
        <Input
          id="filtro-desde"
          type="date"
          value={desde ?? ''}
          onChange={(event) => onDesdeChange(event.target.value === '' ? null : event.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="filtro-hasta">Hasta</Label>
        <Input
          id="filtro-hasta"
          type="date"
          value={hasta ?? ''}
          onChange={(event) => onHastaChange(event.target.value === '' ? null : event.target.value)}
        />
      </div>
      <Button type="button" variant="outline" onClick={onLimpiar}>
        Limpiar filtros
      </Button>
    </div>
  )
}
