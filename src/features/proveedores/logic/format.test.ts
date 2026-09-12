import { describe, expect, it } from 'vitest'
import { etiquetaEstado, formatearFecha } from './format'

describe('formatearFecha', () => {
  it('formatea una fecha ISO a día/mes/año', () => {
    expect(formatearFecha('2026-01-15T10:00:00Z')).toBe('15/01/2026')
  })

  it('devuelve un guion para fechas inválidas', () => {
    expect(formatearFecha('no-es-fecha')).toBe('—')
  })
})

describe('etiquetaEstado', () => {
  it('devuelve la etiqueta legible de cada estado', () => {
    expect(etiquetaEstado('Activo')).toBe('Activo')
    expect(etiquetaEstado('Inactivo')).toBe('Inactivo')
  })
})