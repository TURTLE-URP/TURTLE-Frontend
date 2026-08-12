import { Storefront } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { formatCurrency, groupBySupplier } from '../logic/calculations'
import type { OrderItem } from '../logic/types'

interface StepSummaryProps {
  /** Fully assigned order items, grouped per supplier for the summary. */
  items: OrderItem[]
  /** Called when the administrator confirms and submits the orders. */
  onConfirm: () => void
  /** Disables the confirm button while the orders are being emitted. */
  confirming?: boolean
}

/** Step 4 of the wizard — grouped order summary with cost breakdown. */
export function StepSummary({ items, onConfirm, confirming = false }: StepSummaryProps) {
  const groups = groupBySupplier(items)
  const grandTotal = groups.reduce((sum, group) => sum + group.total, 0)
  const orderWord = groups.length === 1 ? 'orden' : 'órdenes'
  const productWord = items.length === 1 ? 'producto' : 'productos'

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-semibold text-foreground">Resumen de órdenes</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Se generarán <strong>{groups.length}</strong> {orderWord} de abastecimiento.
        </p>
      </div>

      <div className="grid gap-3">
        {groups.map((group) => (
          <div key={group.supplierId} className="overflow-hidden rounded-none border border-border">
            <div className="flex items-center justify-between bg-foreground px-4 py-3 text-background">
              <div className="flex items-center gap-2.5">
                <Storefront size={16} className="shrink-0 opacity-70" />
                <div>
                  <p className="text-xs font-semibold">{group.supplierName}</p>
                  <p className="text-[11px] opacity-60">{group.contact}</p>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-[10px] opacity-60">Subtotal</p>
                <p className="font-mono text-sm font-bold">{formatCurrency(group.total)}</p>
              </div>
            </div>

            <div>
              {group.rows.map(({ item, subtotal }) => {
                const product = item.selectedProduct
                if (!product) {
                  return null
                }
                return (
                  <div
                    key={item.ingredient.id}
                    className="flex items-center justify-between border-b border-border px-4 py-2.5 last:border-0"
                  >
                    <div>
                      <p className="text-xs font-medium text-foreground">{product.name}</p>
                      <p className="text-[11px] text-muted-foreground">
                        Insumo: {item.ingredient.name}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-4 text-right">
                      <span className="w-8 font-mono text-xs text-foreground">{item.qty}</span>
                      <span className="w-16 font-mono text-xs text-muted-foreground">
                        {formatCurrency(product.unitCost)}
                      </span>
                      <span className="w-16 font-mono text-xs font-semibold text-foreground">
                        {formatCurrency(subtotal)}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between rounded-none border border-secondary/30 bg-secondary/10 px-4 py-3">
        <div>
          <p className="text-xs font-semibold text-foreground">Costo total del abasto</p>
          <p className="text-[11px] text-muted-foreground">
            {groups.length} {groups.length === 1 ? 'proveedor' : 'proveedores'} · {items.length}{' '}
            {productWord}
          </p>
        </div>
        <p className="font-mono text-xl font-bold text-secondary">{formatCurrency(grandTotal)}</p>
      </div>

      <div className="space-y-2 pt-1">
        <Button
          onClick={onConfirm}
          variant="secondary"
          size="lg"
          disabled={confirming}
          className="w-full rounded-none font-semibold"
        >
          {confirming
            ? 'Emitiendo…'
            : `Confirmar y emitir ${groups.length === 1 ? 'orden' : `${groups.length} órdenes`}`}
        </Button>
        <p className="text-center text-[11px] text-muted-foreground">
          Se enviará notificación a cada proveedor por sus medios de contacto configurados.
        </p>
      </div>
    </div>
  )
}
