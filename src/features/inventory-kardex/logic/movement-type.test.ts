import { describe, expect, it } from 'vitest'
import { movementTypeBadgeVariant, movementTypeLabel, movementTypeSign } from './movement-type'

describe('movementTypeLabel', () => {
  it('labels each movement type in Spanish', () => {
    expect(movementTypeLabel('entrada')).toBe('Entrada')
    expect(movementTypeLabel('salida')).toBe('Salida')
    expect(movementTypeLabel('merma')).toBe('Merma')
  })
})

describe('movementTypeBadgeVariant', () => {
  it('gives entrada the secondary (green) variant', () => {
    expect(movementTypeBadgeVariant('entrada')).toBe('secondary')
  })

  it('gives salida the default (blue) variant', () => {
    expect(movementTypeBadgeVariant('salida')).toBe('default')
  })

  it('gives merma the destructive (red) variant', () => {
    expect(movementTypeBadgeVariant('merma')).toBe('destructive')
  })
})

describe('movementTypeSign', () => {
  it('is positive for entrada and negative for salida/merma', () => {
    expect(movementTypeSign('entrada')).toBe(1)
    expect(movementTypeSign('salida')).toBe(-1)
    expect(movementTypeSign('merma')).toBe(-1)
  })
})
