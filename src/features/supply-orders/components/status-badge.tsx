import type { OrderStatus } from '../logic/types'

interface StatusBadgeProps {
  /** Status rendered as a pill; text is always present, never color alone. */
  status: OrderStatus
}

const badgeTokens: Record<OrderStatus, string> = {
  Emitida: 'bg-primary/10 text-primary border-primary/20',
  Pendiente: 'bg-chart-4/10 text-chart-4 border-chart-4/20',
  Acordada: 'bg-accent/10 text-accent border-accent/20',
  Entregada: 'bg-secondary/15 text-secondary border-secondary/20',
  Error: 'bg-destructive/10 text-destructive border-destructive/20',
}

const dotTokens: Record<OrderStatus, string> = {
  Emitida: 'bg-primary',
  Pendiente: 'bg-chart-4',
  Acordada: 'bg-accent',
  Entregada: 'bg-secondary',
  Error: 'bg-destructive',
}

/** Semantic status pill for supply orders, following the token mapping. */
export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-none border px-2.5 py-0.5 text-[11px] font-medium ${badgeTokens[status]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dotTokens[status]}`} />
      {status}
    </span>
  )
}
