import { describe, expect, it } from 'vitest'
import { filterInsumos, getMovementsForInsumo } from './kardex-selectors'
import { INSUMOS_FIXTURE } from '../fixtures/insumos.fixtures'
import { KARDEX_MOVEMENTS_FIXTURE } from '../fixtures/movimientos.fixtures'

describe('filterInsumos', () => {
  it('returns every insumo when the query is empty', () => {
    expect(filterInsumos(INSUMOS_FIXTURE, '')).toHaveLength(INSUMOS_FIXTURE.length)
  })

  it('matches by name, case-insensitively', () => {
    const result = filterInsumos(INSUMOS_FIXTURE, 'harina')
    expect(result.map((i) => i.id)).toEqual(['ins-001'])
  })

  it('matches by category', () => {
    const result = filterInsumos(INSUMOS_FIXTURE, 'lácteos')
    expect(result.map((i) => i.id)).toEqual(['ins-004'])
  })

  it('returns an empty array when nothing matches', () => {
    expect(filterInsumos(INSUMOS_FIXTURE, 'no-existe')).toEqual([])
  })
})

describe('getMovementsForInsumo', () => {
  it('returns only the movements for the given insumo', () => {
    const result = getMovementsForInsumo(KARDEX_MOVEMENTS_FIXTURE, 'ins-004')
    expect(result.every((m) => m.insumoId === 'ins-004')).toBe(true)
    expect(result).toHaveLength(3)
  })

  it('sorts movements most recent first', () => {
    const result = getMovementsForInsumo(KARDEX_MOVEMENTS_FIXTURE, 'ins-001')
    const dates = result.map((m) => m.fecha)
    const sortedDescending = [...dates].sort((a, b) => b.localeCompare(a))
    expect(dates).toEqual(sortedDescending)
  })

  it('filters by movement type on top of the insumo filter', () => {
    const result = getMovementsForInsumo(KARDEX_MOVEMENTS_FIXTURE, 'ins-001', { tipo: 'merma' })
    expect(result).toHaveLength(1)
    expect(result[0].tipo).toBe('merma')
  })

  it('returns an empty array for an insumo with no movements', () => {
    expect(getMovementsForInsumo(KARDEX_MOVEMENTS_FIXTURE, 'ins-999')).toEqual([])
  })
})
