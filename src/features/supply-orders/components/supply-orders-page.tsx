import { useState } from 'react'
import { PlusCircleIcon } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { KpiCards } from './kpi-cards'
import { FiltersBar, type StatusFilter } from './filters-bar'
import { OrdersTable } from './orders-table'
import { PreconditionsPanel } from './preconditions-panel'
import { EmitOrderDialog } from './emit-order-dialog'
import { mockOrders, type SupplyOrderRow } from '../logic/mock-data'

function collectIds(rows: SupplyOrderRow[]): string[] {
  return rows.flatMap((row) => ('isGroup' in row && row.isGroup ? [row.id, ...row.orders.map((o) => o.id)] : [row.id]))
}

export function SupplyOrdersPage() {
  const [activeFilter, setActiveFilter] = useState<StatusFilter>('Todas')
  const [searchValue, setSearchValue] = useState('')
  const [rows, setRows] = useState<SupplyOrderRow[]>(mockOrders)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  function handleOrderCreated(newRow: SupplyOrderRow) {
    setRows((prev) => [newRow, ...prev])
  }

  return (
    <section aria-labelledby="supply-orders-title" className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase text-muted-foreground">Módulo · CUS04</p>
          <h1 id="supply-orders-title" className="mt-1 text-2xl font-bold text-foreground">
            Órdenes de Abastecimiento
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gestiona y emite órdenes a tus proveedores.
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <PlusCircleIcon size={18} />
          Emitir orden(es)
        </Button>
      </div>

      <KpiCards />

      <FiltersBar
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
      />

      <OrdersTable rows={rows} />

      <PreconditionsPanel />

      <EmitOrderDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        existingIds={collectIds(rows)}
        onOrderCreated={handleOrderCreated}
      />
    </section>
  )
}