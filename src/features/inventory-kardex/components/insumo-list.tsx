import { MagnifyingGlassIcon, PackageIcon } from '@phosphor-icons/react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { Insumo } from '../types'

export interface InsumoListProps {
  insumos: Insumo[]
  selectedId: string | null
  onSelect: (insumo: Insumo) => void
  query: string
  onQueryChange: (query: string) => void
}

/** Left-hand panel: search box plus the list of insumos to pick a Kardex for. */
export function InsumoList({
  insumos,
  selectedId,
  onSelect,
  query,
  onQueryChange,
}: InsumoListProps) {
  return (
    <div className="flex h-full flex-col gap-3">
      <div className="relative">
        <MagnifyingGlassIcon
          className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Buscar insumo o categoría"
          className="pl-8"
          aria-label="Buscar insumo"
        />
      </div>

      <ul
        className="flex flex-col overflow-y-auto border border-border"
        role="listbox"
        aria-label="Insumos"
      >
        {insumos.length === 0 && (
          <li className="p-4 text-center text-xs text-muted-foreground">Sin resultados.</li>
        )}
        {insumos.map((insumo) => {
          const isSelected = insumo.id === selectedId
          return (
            <li key={insumo.id} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => onSelect(insumo)}
                className={cn(
                  'flex w-full items-center gap-2.5 border-b border-border px-3 py-2.5 text-left last:border-b-0 hover:bg-muted/50',
                  isSelected && 'bg-primary/10',
                )}
              >
                <PackageIcon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-sm font-medium text-foreground">
                    {insumo.nombre}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">{insumo.categoria}</span>
                </span>
                <span className="shrink-0 text-xs font-medium text-foreground">
                  {insumo.stockActual} {insumo.unidadMedida}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
