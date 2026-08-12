import { useMemo, useState } from 'react'
import {
  PlusCircleIcon,
  CheckIcon,
  PackageIcon,
  ClockCountdownIcon,
  CurrencyCircleDollarIcon,
  WarningIcon,
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { useKpis, useSupplyOrders } from '../logic/api/hooks'
import { formatCurrency, formatNumber } from '../logic/calculations'
import { isGroup } from '../logic/types'
import { KpiCard } from './kpi-card'
import { OrderFilters } from './order-filters'
import { OrdersTable } from './orders-table'
import { WizardModal } from './wizard-modal'
import type { HistoryEntry, OrderStatus } from '../logic/types'

const STATUSES: readonly OrderStatus[] = ['Emitida', 'Pendiente', 'Acordada', 'Entregada', 'Error']

const PRECONDITIONS = [
  'Insumos internos registrados con stock deseado',
  'Proveedores con catálogos y medios de contacto',
  'Relaciones de equivalencia insumo ↔ producto',
  'Recetas registradas para abasto por platillos',
]

/** Main page of the Supply Orders module: KPIs, history table and filters. */
export function SupplyOrdersPage() {
  const kpis = useKpis()
  const history = useSupplyOrders()
  const [showWizard, setShowWizard] = useState(false)
  const [activeFilter, setActiveFilter] = useState('Todas')
  const [query, setQuery] = useState('')
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set())

  function toggleGroup(groupId: string) {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(groupId)) {
        next.delete(groupId)
      } else {
        next.add(groupId)
      }
      return next
    })
  }

  const filteredEntries = useMemo(() => {
    const data = history.data ?? []
    const normalized = query.trim().toLowerCase()

    return data.filter((entry: HistoryEntry) => {
      const matchesStatus =
        activeFilter === 'Todas' ||
        (isGroup(entry)
          ? entry.orders.some((order) => order.status === activeFilter)
          : entry.status === activeFilter)

      const matchesQuery =
        normalized === '' ||
        (isGroup(entry)
          ? entry.groupId.toLowerCase().includes(normalized) ||
            entry.orders.some(
              (order) =>
                order.id.toLowerCase().includes(normalized) ||
                order.supplier.toLowerCase().includes(normalized),
            )
          : entry.id.toLowerCase().includes(normalized) ||
            entry.supplier.toLowerCase().includes(normalized))

      return matchesStatus && matchesQuery
    })
  }, [history.data, activeFilter, query])

  const kpiCards =
    kpis.data === undefined
      ? []
      : [
          {
            icon: PackageIcon,
            label: 'Órdenes este mes',
            value: formatNumber(kpis.data.ordersMonth),
            sub: '+2 respecto al mes anterior',
          },
          {
            icon: ClockCountdownIcon,
            label: 'Pendientes de acuerdo',
            value: formatNumber(kpis.data.pendingAgreements),
            sub: 'Requieren seguimiento',
            warn: true,
          },
          {
            icon: CurrencyCircleDollarIcon,
            label: 'Gasto total (julio)',
            value: formatCurrency(kpis.data.spendPeriod),
            sub: 'Entre 4 proveedores',
          },
          {
            icon: WarningIcon,
            label: 'Insumos en escasez',
            value: formatNumber(kpis.data.shortageIngredients),
            sub: 'Bajo stock deseado',
            warn: true,
          },
        ]

  const isLoading = kpis.isPending || history.isPending
  const isError = kpis.isError || history.isError

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Módulo · CUS04
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Órdenes de Abastecimiento
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Gestiona y emite órdenes a tus proveedores.
          </p>
        </div>
        <Button
          onClick={() => setShowWizard(true)}
          variant="secondary"
          size="lg"
          className="shrink-0 gap-2 rounded-none"
          aria-expanded={showWizard}
        >
          <PlusCircleIcon size={24} />
          Emitir orden(es)
        </Button>
      </div>

      {isLoading ? (
        <div
          role="status"
          aria-label="Cargando órdenes de abastecimiento"
          className="space-y-4"
        >
          <div className="h-8 w-56 animate-pulse rounded-none bg-muted" />
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-24 animate-pulse rounded-none border border-border bg-card" />
            ))}
          </div>
        </div>
      ) : isError ? (
        <div
          role="alert"
          className="rounded-none border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive"
        >
          Error al cargar las órdenes de abastecimiento. Inténtalo de nuevo.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {kpiCards.map((kpi) => (
              <KpiCard key={kpi.label} {...kpi} />
            ))}
          </div>

          <OrderFilters
            statuses={STATUSES}
            active={activeFilter}
            onStatusChange={setActiveFilter}
            query={query}
            onQueryChange={setQuery}
          />

          <OrdersTable
            entries={filteredEntries}
            expanded={expanded}
            onToggleGroup={toggleGroup}
          />

          <section
            aria-label="Precondiciones del sistema"
            className="rounded-none border border-border bg-muted/20 p-5"
          >
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Precondiciones del sistema
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {PRECONDITIONS.map((text) => (
                <div key={text} className="flex items-center gap-2 text-xs">
                  <span
                    aria-hidden
                    className="flex h-4 w-4 shrink-0 items-center justify-center rounded-none bg-secondary/15 text-secondary"
                  >
                    <CheckIcon size={12} weight="bold" />
                  </span>
                  <span className="text-foreground">{text}</span>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      <WizardModal open={showWizard} onOpenChange={setShowWizard} />
    </div>
  )
}
