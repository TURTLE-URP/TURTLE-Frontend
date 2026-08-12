import { Input } from '@/components/ui/input'
import type { OrderStatus } from '../logic/types'

interface OrderFiltersProps {
  /** Statuses rendered as filter pills. */
  statuses: readonly OrderStatus[]
  /** Currently selected status ("Todas" when no status filter applies). */
  active: string
  onStatusChange: (status: string) => void
  /** Current search query. */
  query: string
  onQueryChange: (query: string) => void
}

const ALL_FILTER = 'Todas'

/** Status filter pills plus a search input for the orders history. */
export function OrderFilters({
  statuses,
  active,
  onStatusChange,
  query,
  onQueryChange,
}: OrderFiltersProps) {
  const filters = [ALL_FILTER, ...statuses]

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-[11px] font-medium text-muted-foreground">Estado:</span>
      {filters.map((filter) => {
        const pressed = active === filter
        return (
          <button
            key={filter}
            type="button"
            onClick={() => onStatusChange(filter)}
            aria-pressed={pressed}
            className={`rounded-none border px-3 py-1 text-[11px] font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring ${
              pressed
                ? 'border-foreground bg-foreground text-background'
                : 'border-border bg-card text-muted-foreground hover:border-foreground hover:text-foreground'
            }`}
          >
            {filter}
          </button>
        )
      })}
      <div className="ml-auto">
        <Input
          type="search"
          aria-label="Buscar orden por proveedor o ID"
          placeholder="Buscar proveedor o ID…"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          className="w-52"
        />
      </div>
    </div>
  )
}
