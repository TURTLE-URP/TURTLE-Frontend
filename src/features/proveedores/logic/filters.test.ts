import { describe, expect, it } from 'vitest'
import {
  anteriorPagina,
  crearFiltros,
  paginasVisibles,
  siguientePagina,
  TAMANO_PAGINA,
} from './filters'

describe('crearFiltros', () => {
  it('recorta el texto de búsqueda', () => {
    expect(crearFiltros('  andina  ', 1, 10).texto).toBe('andina')
  })

  it('usa el tamaño de página por defecto', () => {
    expect(crearFiltros('', 1).tamano).toBe(TAMANO_PAGINA)
  })

  it('clausura la página mínima en 1', () => {
    expect(crearFiltros('', 0).pagina).toBe(1)
    expect(crearFiltros('', -3).pagina).toBe(1)
  })
})

describe('siguientePagina', () => {
  it('avanza sin superar el total de páginas', () => {
    expect(siguientePagina(1, 3)).toBe(2)
    expect(siguientePagina(3, 3)).toBe(3)
  })
})

describe('anteriorPagina', () => {
  it('retrocede sin bajar de la página 1', () => {
    expect(anteriorPagina(3)).toBe(2)
    expect(anteriorPagina(1)).toBe(1)
  })
})

describe('paginasVisibles', () => {
  it('devuelve vacío sin páginas', () => {
    expect(paginasVisibles(1, 0)).toEqual([])
  })

  it('devuelve la única página', () => {
    expect(paginasVisibles(1, 1)).toEqual([1])
  })

  it('muestra todas cuando son pocas', () => {
    expect(paginasVisibles(1, 3)).toEqual([1, 2, 3])
    expect(paginasVisibles(2, 3)).toEqual([1, 2, 3])
  })

  it('centra la ventana en la página actual', () => {
    expect(paginasVisibles(5, 10)).toEqual([3, 4, 5, 6, 7])
  })

  it('clausura la ventana al inicio y al final', () => {
    expect(paginasVisibles(1, 10)).toEqual([1, 2, 3, 4, 5])
    expect(paginasVisibles(10, 10)).toEqual([6, 7, 8, 9, 10])
  })
})