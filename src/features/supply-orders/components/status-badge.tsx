import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import type { OrderStatus } from '../logic/mock-data'

const statusBadgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
  {
    variants: {
      status: {
        pendiente: 'bg-amber-100 text-amber-800',
        acordada: 'bg-blue-100 text-blue-800',
        entregada: 'bg-green-100 text-green-800',
        error: 'bg-red-100 text-red-800',
      } satisfies Record<OrderStatus, string>,
    },
  },
)

const statusLabels: Record<OrderStatus, string> = {
  pendiente: 'Pendiente',
  acordada: 'Acordada',
  entregada: 'Entregada',
  error: 'Error',
}

export interface StatusBadgeProps extends VariantProps<typeof statusBadgeVariants> {
  status: OrderStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={cn(statusBadgeVariants({ status }))}>
      <span className="size-1.5 rounded-full bg-current" />
      {statusLabels[status]}
    </span>
  )
}