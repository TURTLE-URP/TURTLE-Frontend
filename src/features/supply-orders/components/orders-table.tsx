import { useState } from 'react'
import { CaretDownIcon, CaretRightIcon, StackIcon } from '@phosphor-icons/react'
import { StatusBadge } from './status-badge'
import { isGroupRow, type SupplyOrderRow } from '../logic/mock-data'

export interface OrdersTableProps {
  rows: SupplyOrderRow[]
}

function formatCurrency(amount: number): string {
  return `S/ ${amount.toFixed(2)}`
}

export function OrdersTable({ rows }: OrdersTableProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())

  function toggleGroup(groupId: string) {
    setExpandedGroups((prev) => {
      const next = new Set(prev)
      if (next.has(groupId)) {
        next.delete(groupId)
      } else {
        next.add(groupId)
      }
      return next
    })
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/40 text-xs uppercase text-muted-foreground">
            <th className="px-4 py-3 font-medium">ID / Grupo</th>
            <th className="px-4 py-3 font-medium">Proveedor</th>
            <th className="px-4 py-3 font-medium">Fecha</th>
            <th className="px-4 py-3 font-medium">Modalidad</th>
            <th className="px-4 py-3 font-medium">Estado</th>
            <th className="px-4 py-3 text-right font-medium">Total</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            if (isGroupRow(row)) {
              const isExpanded = expandedGroups.has(row.id)
              return (
                <>
                  <tr
                    key={row.id}
                    onClick={() => toggleGroup(row.id)}
                    className="cursor-pointer border-b border-border last:border-b-0 hover:bg-muted/30"
                  >
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-2 font-medium text-foreground">
                        {isExpanded ? <CaretDownIcon size={14} /> : <CaretRightIcon size={14} />}
                        <StackIcon size={14} className="text-muted-foreground" />
                        {row.id}
                        <span className="font-normal text-muted-foreground">
                          ({row.orders.length} órdenes)
                        </span>
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">Múltiples proveedores</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.date}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.modality}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={row.status} />
                    </td>
                    <td className="px-4 py-3 text-right font-medium">{formatCurrency(row.total)}</td>
                  </tr>

                  {isExpanded &&
                    row.orders.map((order) => (
                      <tr key={order.id} className="border-b border-border bg-muted/10 last:border-b-0">
                        <td className="py-2.5 pl-10 pr-4 text-muted-foreground">└ {order.id}</td>
                        <td className="px-4 py-2.5 font-medium text-foreground">{order.provider}</td>
                        <td className="px-4 py-2.5 text-muted-foreground">{order.date}</td>
                        <td className="px-4 py-2.5 text-muted-foreground">—</td>
                        <td className="px-4 py-2.5">
                          <StatusBadge status={order.status} />
                        </td>
                        <td className="px-4 py-2.5 text-right">{formatCurrency(order.total)}</td>
                      </tr>
                    ))}
                </>
              )
            }

            return (
              <tr key={row.id} className="border-b border-border last:border-b-0 hover:bg-muted/30">
                <td className="px-4 py-3 font-medium text-foreground">{row.id}</td>
                <td className="px-4 py-3 font-medium text-foreground">{row.provider}</td>
                <td className="px-4 py-3 text-muted-foreground">{row.date}</td>
                <td className="px-4 py-3 text-muted-foreground">—</td>
                <td className="px-4 py-3">
                  <StatusBadge status={row.status} />
                </td>
                <td className="px-4 py-3 text-right font-medium">{formatCurrency(row.total)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}