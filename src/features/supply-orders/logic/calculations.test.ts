import { describe, expect, it } from 'vitest'
import { formatCurrency, formatNumber, groupBySupplier } from './calculations'
import { SUPPLIER_PRODUCTS } from './__fixtures__'
import type { Ingredient, OrderItem } from './types'

const ingredient: Ingredient = {
  id: 'i1',
  name: 'Harina de trigo',
  unit: 'kg',
  currentStock: 8,
  desiredStock: 25,
  category: 'Secos',
}

function makeItem(productId: string | undefined, qty: number): OrderItem {
  const selectedProduct = productId ? SUPPLIER_PRODUCTS.find((p) => p.id === productId) : undefined
  return { ingredient, qty, selectedProduct }
}

describe('groupBySupplier', () => {
  it('groups items by supplier with subtotals and totals', () => {
    const groups = groupBySupplier([
      makeItem('p1', 2),
      makeItem('p5', 3),
      makeItem('p1', 1),
    ])

    expect(groups).toHaveLength(2)

    const norte = groups.find((g) => g.supplierId === 's1')
    expect(norte?.rows).toHaveLength(2)
    expect(norte?.total).toBeCloseTo(58.5 * 3, 5)

    const agro = groups.find((g) => g.supplierId === 's5')
    expect(agro?.rows).toHaveLength(1)
    expect(agro?.total).toBeCloseTo(28.0 * 3, 5)
  })

  it('handles a single supplier', () => {
    const groups = groupBySupplier([makeItem('p1', 4)])
    expect(groups).toHaveLength(1)
    expect(groups[0].supplierName).toBe('Molinos del Norte')
  })

  it('skips items without a selected product', () => {
    const groups = groupBySupplier([makeItem(undefined, 4), makeItem('p1', 2)])
    expect(groups).toHaveLength(1)
    expect(groups[0].total).toBeCloseTo(58.5 * 2, 5)
  })

  it('returns an empty array when no items have products', () => {
    expect(groupBySupplier([makeItem(undefined, 1)])).toEqual([])
  })
})

describe('formatCurrency', () => {
  it('formats with the es-PE locale and PEN symbol', () => {
    expect(formatCurrency(186.5)).toBe('S/ 186.50')
  })

  it('formats large amounts with thousands separators', () => {
    expect(formatCurrency(1108)).toBe('S/ 1,108.00')
  })

  it('formats zero', () => {
    expect(formatCurrency(0)).toBe('S/ 0.00')
  })
})

describe('formatNumber', () => {
  it('formats counts with the es-PE locale', () => {
    expect(formatNumber(1108)).toBe('1,108')
  })

  it('formats small counts without separators', () => {
    expect(formatNumber(7)).toBe('7')
  })
})
