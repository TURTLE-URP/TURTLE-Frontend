import { DISHES, INGREDIENTS, ORDER_HISTORY } from '../__fixtures__'
import { groupBySupplier } from '../calculations'
import type { HistoryEntry, Ingredient, OrderGroup, OrderItem, SendStatus, SingleOrder } from '../types'
import type { CalculateRequest } from './dtos'

const FAILING_SUPPLIER_IDS = new Set(['s4'])

function round(value: number, decimals = 2): number {
  const factor = 10 ** decimals
  return Math.round(value * factor) / factor
}

export function calculateDishItems(dishQtys: Record<string, number>): OrderItem[] {
  const aggregated = new Map<string, number>()

  for (const dish of DISHES) {
    const qty = dishQtys[dish.id] ?? 0
    if (qty <= 0) {
      continue
    }
    for (const line of dish.ingredients) {
      aggregated.set(line.ingredientId, (aggregated.get(line.ingredientId) ?? 0) + line.qty * qty)
    }
  }

  return [...aggregated.entries()].flatMap(([ingredientId, qty]) => {
    const ingredient = INGREDIENTS.find((i) => i.id === ingredientId)
    return ingredient ? [{ ingredient, qty: round(qty, 1) }] : []
  })
}

export function calculateShortageItems(ingredients: Ingredient[] = INGREDIENTS): OrderItem[] {
  return ingredients
    .filter((i) => i.currentStock < i.desiredStock)
    .map((i) => ({ ingredient: i, qty: i.desiredStock - i.currentStock }))
}

export function buildFreeItems(quantities: Record<string, number>): OrderItem[] {
  return Object.entries(quantities).flatMap(([id, qty]) => {
    const ingredient = INGREDIENTS.find((i) => i.id === id)
    return ingredient && qty > 0 ? [{ ingredient, qty: round(qty, 1) }] : []
  })
}

export function calculate(request: CalculateRequest): OrderItem[] {
  switch (request.modality) {
    case 'platillos':
      return calculateDishItems(request.dishQtys)
    case 'escasez':
      return calculateShortageItems()
    case 'libre':
      return buildFreeItems(request.quantities)
  }
}

export interface EmitResult {
  group: OrderGroup
  orders: SingleOrder[]
  sendStatus: Record<string, SendStatus>
}

const MODALITY_LABELS: Record<string, string> = {
  platillos: 'Por platillos',
  escasez: 'Por escasez',
  libre: 'Abasto libre',
}

function extractNumber(id: string): number {
  const match = /(\d+)$/.exec(id)
  return match ? Number.parseInt(match[1], 10) : 0
}

function latestOrderNumber(): number {
  let max = 0
  const scan = (entry: HistoryEntry): void => {
    if ('groupId' in entry) {
      for (const order of entry.orders) {
        max = Math.max(max, extractNumber(order.id))
      }
    } else {
      max = Math.max(max, extractNumber(entry.id))
    }
  }
  ORDER_HISTORY.forEach(scan)
  return max
}

export function emitOrders(
  items: OrderItem[],
  options: { date?: string; modality?: string } = {},
): EmitResult {
  const date = options.date ?? new Date().toISOString().slice(0, 10)
  const modality = MODALITY_LABELS[options.modality ?? 'libre'] ?? 'Abasto libre'
  const groups = groupBySupplier(items)
  const baseNumber = latestOrderNumber()

  const orders: SingleOrder[] = groups.map((group, index) => {
    const send: SendStatus = FAILING_SUPPLIER_IDS.has(group.supplierId) ? 'error' : 'sent'
    return {
      id: `OA-${String(baseNumber + index + 1).padStart(4, '0')}`,
      supplier: group.supplierName,
      date,
      status: send === 'error' ? 'Pendiente' : 'Emitida',
      total: round(group.total),
      products: group.rows.length,
    }
  })

  const groupCount = ORDER_HISTORY.filter((entry) => 'groupId' in entry).length
  const group: OrderGroup = {
    groupId: `G-${String(groupCount + 1).padStart(3, '0')}`,
    date,
    modality,
    orders,
  }

  const sendStatus: Record<string, SendStatus> = Object.fromEntries(
    groups.map((groupEntry) => [
      groupEntry.supplierId,
      FAILING_SUPPLIER_IDS.has(groupEntry.supplierId) ? 'error' : 'sent',
    ]),
  )

  return { group, orders, sendStatus }
}
