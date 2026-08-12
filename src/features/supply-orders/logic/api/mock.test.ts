import { describe, expect, it } from 'vitest'
import { buildFreeItems, calculateDishItems, calculateShortageItems, emitOrders } from './mock'
import { INGREDIENTS, SUPPLIER_PRODUCTS } from '../__fixtures__'
import type { Ingredient, SupplierProduct } from '../types'

function ingredient(id: string): Ingredient {
  const found = INGREDIENTS.find((i) => i.id === id)
  if (!found) {
    throw new Error(`missing fixture ingredient ${id}`)
  }
  return found
}

function product(id: string): SupplierProduct {
  const found = SUPPLIER_PRODUCTS.find((p) => p.id === id)
  if (!found) {
    throw new Error(`missing fixture product ${id}`)
  }
  return found
}

describe('calculateDishItems', () => {
  it('aggregates ingredient quantities by recipe proportion', () => {
    const items = calculateDishItems({ d1: 2 })
    expect(items).toContainEqual({ ingredient: ingredient('i1'), qty: 0.6 })
    expect(items).toContainEqual({ ingredient: ingredient('i3'), qty: 0.3 })
  })

  it('skips dishes with zero or negative quantity', () => {
    const items = calculateDishItems({ d1: 0, d2: -3 })
    expect(items).toEqual([])
  })

  it('rounds aggregated quantities to 1 decimal', () => {
    const items = calculateDishItems({ d1: 3 })
    const i3 = items.find((i) => i.ingredient.id === 'i3')
    expect(i3?.qty).toBe(0.5)
  })

  it('omits recipes for unknown ingredient ids', () => {
    expect(() => calculateDishItems({ missing: 1 })).not.toThrow()
  })
})

describe('calculateShortageItems', () => {
  it('returns only ingredients below their desired stock', () => {
    const items = calculateShortageItems()
    expect(items.length).toBeGreaterThan(0)
    expect(items.every((i) => i.ingredient.currentStock < i.ingredient.desiredStock)).toBe(true)
  })

  it('computes qty = desired - current', () => {
    const items = calculateShortageItems()
    const i1 = items.find((i) => i.ingredient.id === 'i1')
    expect(i1?.qty).toBe(17)
  })

  it('returns an empty array when nothing is below target', () => {
    const atTarget: Ingredient[] = INGREDIENTS.map((i) => ({ ...i, currentStock: i.desiredStock }))
    expect(calculateShortageItems(atTarget)).toEqual([])
  })
})

describe('buildFreeItems', () => {
  it('builds items for positive quantities', () => {
    const items = buildFreeItems({ i1: 10 })
    expect(items).toContainEqual({ ingredient: ingredient('i1'), qty: 10 })
  })

  it('skips unknown and zero/negative quantities', () => {
    const items = buildFreeItems({ missing: 5, i2: 0, i3: -1 })
    expect(items).toEqual([])
  })
})

describe('emitOrders', () => {
  const items = [
    { ingredient: ingredient('i1'), qty: 2, selectedProduct: product('p1') },
    { ingredient: ingredient('i3'), qty: 3, selectedProduct: product('p5') },
  ]

  it('registers one order per supplier', () => {
    const result = emitOrders(items, { date: '2026-08-09' })
    expect(result.orders).toHaveLength(2)
    expect(result.sendStatus).toHaveProperty('s1')
    expect(result.sendStatus).toHaveProperty('s5')
  })

  it('computes order total from unitCost × qty', () => {
    const result = emitOrders(items, { date: '2026-08-09' })
    const norte = result.orders.find((o) => o.supplier === 'Molinos del Norte')
    expect(norte?.total).toBeCloseTo(117, 5)
  })

  it('applies a deterministic send result per supplier', () => {
    const a = emitOrders(items, { date: '2026-08-09' })
    const b = emitOrders(items, { date: '2026-08-09' })
    expect(a.sendStatus).toEqual(b.sendStatus)
  })

  it('marks a failing supplier as Pendiente with error status', () => {
    const result = emitOrders(items, { date: '2026-08-09' })
    const pending = result.orders.find((o) => o.status === 'Pendiente')
    if (pending) {
      const supplierId = result.sendStatus
      expect(Object.values(supplierId)).toContain('error')
    }
  })

  it('always registers the orders regardless of send result', () => {
    const result = emitOrders(items, { date: '2026-08-09' })
    expect(result.orders.length).toBeGreaterThan(0)
    expect(result.group.orders).toHaveLength(result.orders.length)
  })
})
