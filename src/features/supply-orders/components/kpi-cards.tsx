import type { ReactNode } from 'react'
import { ClockIcon, PackageIcon, CurrencyCircleDollarIcon, WarningIcon } from '@phosphor-icons/react'
import { mockKpis } from '../logic/mock-data'

interface KpiCardProps {
  label: string
  value: string
  note: string
  icon: ReactNode
  tone?: 'default' | 'warning'
}

function KpiCard({ label, value, note, icon, tone = 'default' }: KpiCardProps) {
  return (
    <div
      className={
        tone === 'warning'
          ? 'rounded-xl border border-red-200 bg-card p-4'
          : 'rounded-xl border border-border bg-card p-4'
      }
    >
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{label}</span>
        {icon}
      </div>
      <p className={tone === 'warning' ? 'mt-2 text-2xl font-semibold text-red-600' : 'mt-2 text-2xl font-semibold text-card-foreground'}>
        {value}
      </p>
      <p className={tone === 'warning' ? 'mt-1 text-xs text-red-500' : 'mt-1 text-xs text-muted-foreground'}>{note}</p>
    </div>
  )
}

export function KpiCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <KpiCard
        label="Órdenes este mes"
        value={String(mockKpis.ordersThisMonth.value)}
        note={mockKpis.ordersThisMonth.delta}
        icon={<PackageIcon size={18} />}
      />
      <KpiCard
        label="Pendientes de acuerdo"
        value={String(mockKpis.pendingAgreement.value)}
        note={mockKpis.pendingAgreement.note}
        icon={<ClockIcon size={18} />}
        tone="warning"
      />
      <KpiCard
        label="Gasto total (julio)"
        value={`S/ ${mockKpis.totalSpend.value.toFixed(0)}`}
        note={mockKpis.totalSpend.note}
        icon={<CurrencyCircleDollarIcon size={18} />}
      />
      <KpiCard
        label="Insumos en escasez"
        value={String(mockKpis.lowStockInputs.value)}
        note={mockKpis.lowStockInputs.note}
        icon={<WarningIcon size={18} />}
        tone="warning"
      />
    </div>
  )
}