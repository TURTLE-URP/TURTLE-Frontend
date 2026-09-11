import type { SupplyOrderRow, OrderStatus } from './mock-data'
import { providerProducts, type ProviderProduct } from './catalog'

export interface NeededInput {
  rawMaterialId: string
  rawMaterialName: string
  qty: number
  unit: string
}

export interface BuildOrderParams {
  modality: string
  neededInputs: NeededInput[]
  selectedProducts: Record<string, string> // rawMaterialId -> providerProductId elegido
  existingIds: string[]
}

function totalOf(items: { product: ProviderProduct; qty: number }[]): number {
  return items.reduce((sum, { product, qty }) => sum + product.unitPrice * qty, 0)
}

export function buildOrderRowFromSelection({
  modality,
  neededInputs,
  selectedProducts,
  existingIds,
}: BuildOrderParams): SupplyOrderRow {
  const today = new Date().toISOString().slice(0, 10)
  const status: OrderStatus = 'pendiente'

  const byProvider = new Map<string, { providerName: string; items: { product: ProviderProduct; qty: number }[] }>()

  for (const input of neededInputs) {
    const productId = selectedProducts[input.rawMaterialId]
    const product = providerProducts.find((candidate) => candidate.id === productId)
    if (!product) continue

    const entry = byProvider.get(product.providerId)
    if (entry) {
      entry.items.push({ product, qty: input.qty })
    } else {
      byProvider.set(product.providerId, { providerName: product.providerName, items: [{ product, qty: input.qty }] })
    }
  }

  const providerEntries = Array.from(byProvider.values())
  const nextOrderNumber = existingIds.filter((id) => id.startsWith('OA-')).length + 1

  if (providerEntries.length <= 1) {
    const entry = providerEntries[0]
    return {
      id: `OA-${String(nextOrderNumber).padStart(4, '0')}`,
      provider: entry?.providerName ?? 'Sin proveedor',
      date: today,
      total: entry ? totalOf(entry.items) : 0,
      status,
    }
  }

  const orders = providerEntries.map((entry, index) => ({
    id: `OA-${String(nextOrderNumber + index).padStart(4, '0')}`,
    provider: entry.providerName,
    date: today,
    total: totalOf(entry.items),
    status,
  }))

  const groupNumber = existingIds.filter((id) => id.startsWith('G-')).length + 1

  return {
    id: `G-${String(groupNumber).padStart(3, '0')}`,
    isGroup: true,
    modality,
    date: today,
    total: orders.reduce((sum, order) => sum + order.total, 0),
    status,
    orders,
  }
}