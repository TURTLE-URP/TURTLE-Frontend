import { describe, expect, it } from 'vitest'
import { MockCotizacionesRepository } from './mock-cotizaciones-repository'
import type { FiltrosCotizaciones } from './types'

const BASE: FiltrosCotizaciones = {
  texto: '',
  estado: 'todas',
  desde: null,
  hasta: null,
  pagina: 1,
  tamano: 10,
}

function repo() {
  return new MockCotizacionesRepository({ latenciaMs: 0 })
}

describe('MockCotizacionesRepository', () => {
  it('pagina la primera página con 10 items de 25', async () => {
    const listado = await repo().listar(BASE)
    expect(listado.items).toHaveLength(10)
    expect(listado.total).toBe(25)
    expect(listado.totalPaginas).toBe(3)
    expect(listado.pagina).toBe(1)
  })

  it('devuelve la segunda página sin repetir items', async () => {
    const r = repo()
    const primera = await r.listar(BASE)
    const segunda = await r.listar({ ...BASE, pagina: 2 })
    expect(segunda.pagina).toBe(2)
    expect(segunda.items).toHaveLength(10)
    const folios = new Set([...primera.items, ...segunda.items].map((c) => c.folio))
    expect(folios.size).toBe(20)
  })

  it('filtra por texto parcial sobre folio y proveedor', async () => {
    const r = repo()
    const porFolio = await r.listar({ ...BASE, texto: 'COT-2026-001' })
    expect(porFolio.total).toBeGreaterThanOrEqual(1)
    expect(porFolio.items.every((c) => c.folio.includes('COT-2026-001'))).toBe(true)
    const porProveedor = await r.listar({ ...BASE, texto: 'andina' })
    expect(porProveedor.total).toBeGreaterThanOrEqual(1)
    expect(
      porProveedor.items.every((c) => c.proveedorNombre.toLowerCase().includes('andina')),
    ).toBe(true)
  })

  it('filtra por estado de solicitud', async () => {
    const listado = await repo().listar({ ...BASE, estado: 'aprobada' })
    expect(listado.total).toBeGreaterThan(0)
    expect(listado.items.every((c) => c.solicitudEstado === 'aprobada')).toBe(true)
  })

  it('filtra por rango de fechas inclusivo', async () => {
    const listado = await repo().listar({ ...BASE, desde: '2026-09-10', hasta: '2026-09-12' })
    expect(listado.total).toBe(3)
    expect(listado.items.every((c) => c.fecha >= '2026-09-10' && c.fecha <= '2026-09-12')).toBe(true)
  })

  it('devuelve items vacíos sin error cuando no hay coincidencias', async () => {
    const listado = await repo().listar({ ...BASE, texto: 'zzz-sin-coincidencia' })
    expect(listado.items).toEqual([])
    expect(listado.total).toBe(0)
    expect(listado.totalPaginas).toBe(0)
  })

  it('lanza error con mensaje seguro cuando falla la carga', async () => {
    const r = new MockCotizacionesRepository({ latenciaMs: 0, fallar: true })
    await expect(r.listar(BASE)).rejects.toThrow('No se pudo cargar el listado de cotizaciones.')
  })
})
