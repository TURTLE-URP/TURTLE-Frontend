import type { OrderItem } from './types'

export interface SupplierGroupRow {
  item: OrderItem
  subtotal: number
}

export interface SupplierGroup {
  supplierId: string
  supplierName: string
  contact: string
  rows: SupplierGroupRow[]
  total: number
}

export function groupBySupplier(items: OrderItem[]): SupplierGroup[] {
  const groups = new Map<string, SupplierGroup>()

  for (const item of items) {
    const product = item.selectedProduct
    if (!product) {
      continue
    }

    let group = groups.get(product.supplierId)
    if (!group) {
      group = {
        supplierId: product.supplierId,
        supplierName: product.supplierName,
        contact: product.contact,
        rows: [],
        total: 0,
      }
      groups.set(product.supplierId, group)
    }

    const subtotal = product.unitCost * item.qty
    group.rows.push({ item, subtotal })
    group.total += subtotal
  }

  return [...groups.values()]
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' })
    .format(value)
    .replace(/\u00A0/g, ' ')
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('es-PE').format(value).replace(/\u00A0/g, ' ')
}
