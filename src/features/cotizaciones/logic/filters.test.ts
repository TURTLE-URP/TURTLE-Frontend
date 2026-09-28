import { describe, expect, it } from 'vitest'
import { anteriorPagina, crearFiltros, describirCriterios, paginasVisibles, siguientePagina } from './filters'

describe('crearFiltros', () => {
  it('recorta el texto y fija página mínima y tamaño', () => {
    expect(crearFiltros('  COT-1 ', 'todas', null, null, 0)).toEqual({
      texto: 'COT-1',
      estado: 'todas',
      desde: null,
      hasta: null,
      pagina: 1,
      tamano: 10,
    })
  })

  it('conserva estado y rango de fechas', () => {
    const filtros = crearFiltros('', 'aprobada', '2026-09-01', '2026-09-30', 2)
    expect(filtros.estado).toBe('aprobada')
    expect(filtros.desde).toBe('2026-09-01')
    expect(filtros.hasta).toBe('2026-09-30')
    expect(filtros.pagina).toBe(2)
  })
})

describe('describirCriterios', () => {
  it('describe texto, estado y fechas para el mensaje sin resultados', () => {
    const texto = describirCriterios(crearFiltros('andina', 'aprobada', '2026-09-01', '2026-09-30', 1))
    expect(texto).toContain('andina')
    expect(texto).toContain('aprobada')
    expect(texto).toContain('2026-09-01')
    expect(texto).toContain('2026-09-30')
  })

  it('omite los criterios no aplicados', () => {
    expect(describirCriterios(crearFiltros('', 'todas', null, null, 1))).toBe('sin filtros aplicados')
  })
})

describe('paginación', () => {
  it('avanza y retrocede dentro de los bordes', () => {
    expect(siguientePagina(1, 3)).toBe(2)
    expect(siguientePagina(3, 3)).toBe(3)
    expect(anteriorPagina(2)).toBe(1)
    expect(anteriorPagina(1)).toBe(1)
  })

  it('calcula páginas visibles alrededor de la actual', () => {
    expect(paginasVisibles(2, 3)).toEqual([1, 2, 3])
    expect(paginasVisibles(1, 0)).toEqual([])
  })
})
