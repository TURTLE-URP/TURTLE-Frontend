import { MagnifyingGlassIcon } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

const statusFilters = ['Todas', 'Pendiente', 'Acordada', 'Entregada', 'Error'] as const
export type StatusFilter = (typeof statusFilters)[number]

export interface FiltersBarProps {
  activeFilter: StatusFilter
  onFilterChange: (filter: StatusFilter) => void
  searchValue: string
  onSearchChange: (value: string) => void
}

export function FiltersBar({ activeFilter, onFilterChange, searchValue, onSearchChange }: FiltersBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Estado:</span>
        {statusFilters.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => onFilterChange(filter)}
            className={cn(
              'rounded-full px-3 py-1.5 text-sm transition-colors',
              activeFilter === filter
                ? 'bg-foreground text-background'
                : 'border border-border text-muted-foreground hover:bg-muted',
            )}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="relative">
        <MagnifyingGlassIcon
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          type="text"
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Buscar proveedor o ID..."
          className="w-64 rounded-lg border border-border bg-card py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
    </div>
  )
}