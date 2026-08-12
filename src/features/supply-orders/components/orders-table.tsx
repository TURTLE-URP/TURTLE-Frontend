import { CaretRight, Package } from '@phosphor-icons/react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatCurrency } from '../logic/calculations'
import { isGroup } from '../logic/types'
import { StatusBadge } from './status-badge'
import type { HistoryEntry, OrderGroup, OrderStatus, SingleOrder } from '../logic/types'

interface OrdersTableProps {
  /** Flat history entries; groups are rendered as expandable rows. */
  entries: HistoryEntry[]
  /** groupIds currently expanded. */
  expanded: Set<string>
  /** Called with the groupId when its expand control is activated. */
  onToggleGroup: (groupId: string) => void
  /** Message shown when the history is empty. */
  emptyMessage?: string
}

/** Expandable history of supply orders and order groups. */
export function OrdersTable({
  entries,
  expanded,
  onToggleGroup,
  emptyMessage = 'Aún no hay órdenes registradas.',
}: OrdersTableProps) {
  return (
    <Table aria-label="Órdenes de abastecimiento">
      <TableHeader>
        <TableRow>
          <TableHead className="w-10" />
          <TableHead>ID / Grupo</TableHead>
          <TableHead>Proveedor</TableHead>
          <TableHead>Fecha</TableHead>
          <TableHead>Modalidad</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right">Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {entries.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7}>
              <p className="py-6 text-center text-xs text-muted-foreground">{emptyMessage}</p>
            </TableCell>
          </TableRow>
        ) : (
          entries.map((entry) =>
            isGroup(entry) ? (
              <GroupRow
                key={entry.groupId}
                group={entry}
                open={expanded.has(entry.groupId)}
                onToggle={() => onToggleGroup(entry.groupId)}
              />
            ) : (
              <SingleRow key={entry.id} order={entry} />
            ),
          )
        )}
      </TableBody>
    </Table>
  )
}

function GroupRow({
  group,
  open,
  onToggle,
}: {
  group: OrderGroup
  open: boolean
  onToggle: () => void
}) {
  const groupTotal = group.orders.reduce((sum, order) => sum + order.total, 0)
  const allDelivered = group.orders.every((order) => order.status === 'Entregada')
  const groupStatus: OrderStatus = allDelivered ? 'Entregada' : 'Acordada'
  const panelId = `orders-${group.groupId}`

  return (
    <>
      <TableRow>
        <TableCell>
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={open}
            aria-controls={panelId}
            aria-label={`${open ? 'Contraer' : 'Expandir'} grupo ${group.groupId}`}
            className="flex h-6 w-6 items-center justify-center rounded-none text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          >
            <CaretRight
              size={12}
              className={`transition-transform duration-200 ${open ? 'rotate-90' : ''}`}
            />
          </button>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <Package size={14} className="shrink-0 text-muted-foreground" />
            <span className="font-mono text-xs font-semibold text-foreground">{group.groupId}</span>
            <span className="text-[11px] text-muted-foreground">
              ({group.orders.length} órdenes)
            </span>
          </div>
        </TableCell>
        <TableCell className="text-xs text-muted-foreground">Múltiples proveedores</TableCell>
        <TableCell className="font-mono text-xs text-muted-foreground">{group.date}</TableCell>
        <TableCell className="text-xs text-muted-foreground">{group.modality}</TableCell>
        <TableCell>
          <StatusBadge status={groupStatus} />
        </TableCell>
        <TableCell className="text-right font-mono text-xs font-semibold text-foreground">
          {formatCurrency(groupTotal)}
        </TableCell>
      </TableRow>
      {open && (
        <TableRow id={panelId}>
          <TableCell colSpan={7} className="p-0">
            <Table aria-label={`Órdenes del grupo ${group.groupId}`}>
              <TableBody>
                {group.orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="w-10" />
                    <TableCell>
                      <span className="pl-4 font-mono text-[11px] text-muted-foreground">
                        ↳ {order.id}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs font-medium text-foreground">
                      {order.supplier}
                    </TableCell>
                    <TableCell className="font-mono text-[11px] text-muted-foreground">
                      {order.date}
                    </TableCell>
                    <TableCell className="text-[11px] text-muted-foreground">—</TableCell>
                    <TableCell>
                      <StatusBadge status={order.status} />
                    </TableCell>
                    <TableCell className="text-right font-mono text-[11px] font-medium text-foreground">
                      {formatCurrency(order.total)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableCell>
        </TableRow>
      )}
    </>
  )
}

function SingleRow({ order }: { order: SingleOrder }) {
  return (
    <TableRow>
      <TableCell className="w-10" />
      <TableCell className="font-mono text-xs text-muted-foreground">{order.id}</TableCell>
      <TableCell className="text-xs font-medium text-foreground">{order.supplier}</TableCell>
      <TableCell className="font-mono text-xs text-muted-foreground">{order.date}</TableCell>
      <TableCell className="text-xs text-muted-foreground">—</TableCell>
      <TableCell>
        <StatusBadge status={order.status} />
      </TableCell>
      <TableCell className="text-right font-mono text-xs font-semibold text-foreground">
        {formatCurrency(order.total)}
      </TableCell>
    </TableRow>
  )
}
