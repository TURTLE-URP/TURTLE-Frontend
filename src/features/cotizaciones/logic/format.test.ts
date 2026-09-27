import { describe, expect, it } from 'vitest'
import { formatearFecha, formatearMoneda } from './format'

describe('formatearMoneda', () => {
  it('formatea con 2 decimales y código de moneda', () => {
    expect(formatearMoneda(1250.5, 'PEN')).toBe('PEN 1,250.50')
  })

  it('formatea el cero', () => {
    expect(formatearMoneda(0, 'PEN')).toBe('PEN 0.00')
  })
})

describe('formatearFecha', () => {
  it('convierte ISO a formato corto legible', () => {
    expect(formatearFecha('2026-09-20')).toBe('20/09/2026')
  })
})
