import { describe, expect, it } from 'vitest'
import { etiquetaCondicion, formatearFecha } from './format'

describe('formatearFecha', () => {
  it('formatea una fecha ISO a día/mes/año', () => {
    expect(formatearFecha('2026-01-15T10:00:00Z')).toBe('15/01/2026')
  })

  it('devuelve un guion para fechas inválidas', () => {
    expect(formatearFecha('no-es-fecha')).toBe('—')
  })
})

describe('etiquetaCondicion', () => {
  it('devuelve la etiqueta legible de cada condición', () => {
    expect(etiquetaCondicion('Habido')).toBe('Habido')
    expect(etiquetaCondicion('No habido')).toBe('No habido')
    expect(etiquetaCondicion('No hallado')).toBe('No hallado')
    expect(etiquetaCondicion('En proceso de verificación')).toBe('En proceso de verificación')
  })
})