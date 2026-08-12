import { describe, expect, it } from 'vitest'
import { fromCalculatedItems, fromCatalog, fromEmitResult, fromHistory, fromKpis } from './mappers'
import { ApiError } from './client'

describe('fromCalculatedItems', () => {
  it('accepts valid order items', () => {
    const items = fromCalculatedItems([
      { ingredient: { id: 'i1', name: 'Harina', unit: 'kg', currentStock: 0, desiredStock: 10, category: 'Secos' }, qty: 5 },
    ])
    expect(items).toHaveLength(1)
    expect(items[0].qty).toBe(5)
  })

  it('rejects a payload with invalid quantities', () => {
    expect(() => fromCalculatedItems([{ ingredient: {}, qty: -1 }])).toThrow(ApiError)
  })

  it('rejects non-array payloads', () => {
    expect(() => fromCalculatedItems(null)).toThrow(ApiError)
  })
})

describe('fromKpis', () => {
  it('accepts valid KPI payloads', () => {
    const kpis = fromKpis({ ordersMonth: 12, pendingAgreements: 2, spendPeriod: 186.5, shortageIngredients: 6 })
    expect(kpis.ordersMonth).toBe(12)
  })

  it('rejects invalid KPI payloads', () => {
    expect(() => fromKpis({ ordersMonth: 'nope' })).toThrow(ApiError)
  })
})

describe('fromCatalog', () => {
  it('accepts a valid catalog payload', () => {
    const catalog = fromCatalog({ ingredients: [], dishes: [], supplierProducts: [] })
    expect(catalog.dishes).toEqual([])
  })

  it('rejects a catalog missing collections', () => {
    expect(() => fromCatalog({ ingredients: [] })).toThrow(ApiError)
  })
})

describe('fromHistory', () => {
  it('accepts valid history entries', () => {
    const entries = fromHistory([{ id: 'OA-0001', supplier: 'S', date: '2026-08-01', status: 'Emitida', total: 1, products: 1 }])
    expect(entries).toHaveLength(1)
  })

  it('rejects invalid history entries', () => {
    expect(() => fromHistory([{ notAnOrder: true }])).toThrow(ApiError)
  })
})

describe('fromEmitResult', () => {
  it('accepts a valid emit result', () => {
    const result = fromEmitResult({
      orders: [],
      sendStatus: {},
      group: { groupId: 'G-003', date: '2026-08-09', modality: 'Abasto libre', orders: [] },
    })
    expect(result.group.groupId).toBe('G-003')
  })

  it('rejects a result with a malformed sendStatus', () => {
    expect(() =>
      fromEmitResult({ orders: [], sendStatus: { s1: 'maybe' }, group: { groupId: 'G', date: 'x', modality: 'm', orders: [] } }),
    ).toThrow(ApiError)
  })
})
