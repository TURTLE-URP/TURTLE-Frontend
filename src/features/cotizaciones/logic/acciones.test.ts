import { describe, expect, it } from 'vitest'
import { accionesDisponibles } from './acciones'
import type { Cotizacion } from '../data/types'

function cotizacion(estado: Cotizacion['solicitudEstado']): Cotizacion {
  return {
    id: 'c01',
    folio: 'COT-2026-001',
    proveedorNombre: 'Agro Andina',
    fecha: '2026-09-02',
    solicitudId: 's-c01',
    solicitudEstado: estado,
    total: 1250.5,
    moneda: 'PEN',
    ordenCompraId: estado === 'aprobada' ? 'oc-101' : null,
  }
}

describe('accionesDisponibles', () => {
  it('habilita cerrar solo en negociación', () => {
    expect(accionesDisponibles(cotizacion('en negociación')).cerrar.habilitada).toBe(true)
    const bloqueada = accionesDisponibles(cotizacion('aprobada')).cerrar
    expect(bloqueada.habilitada).toBe(false)
    expect(bloqueada.motivo).toContain('negociación')
  })

  it('habilita ver Orden solo en aprobada', () => {
    expect(accionesDisponibles(cotizacion('aprobada')).verOrden.habilitada).toBe(true)
    const bloqueada = accionesDisponibles(cotizacion('rechazada')).verOrden
    expect(bloqueada.habilitada).toBe(false)
    expect(bloqueada.motivo).toContain('aprobada')
  })

  it('ver detalles siempre está habilitado', () => {
    for (const estado of ['aprobada', 'en negociación', 'rechazada'] as const) {
      expect(accionesDisponibles(cotizacion(estado)).verDetalle.habilitada).toBe(true)
    }
  })
})
