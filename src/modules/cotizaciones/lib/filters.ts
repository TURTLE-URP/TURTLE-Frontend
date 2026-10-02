import type { FiltrosCotizaciones, FiltroEstado } from '../interfaces/types'

export const TAMANO_PAGINA = 10

export function crearFiltros(
  texto: string,
  estado: FiltroEstado,
  desde: string | null,
  hasta: string | null,
  pagina: number,
  tamano = TAMANO_PAGINA,
): FiltrosCotizaciones {
  return {
    texto: texto.trim(),
    estado,
    desde: desde && desde.length > 0 ? desde : null,
    hasta: hasta && hasta.length > 0 ? hasta : null,
    pagina: Math.max(1, pagina),
    tamano,
  }
}

export function describirCriterios(filtros: FiltrosCotizaciones): string {
  const partes: string[] = []
  if (filtros.texto) partes.push(`folio o proveedor «${filtros.texto}»`)
  if (filtros.estado !== 'todas') partes.push(`estado «${filtros.estado}»`)
  if (filtros.desde) partes.push(`desde ${filtros.desde}`)
  if (filtros.hasta) partes.push(`hasta ${filtros.hasta}`)
  return partes.length > 0 ? partes.join(', ') : 'sin filtros aplicados'
}

export function siguientePagina(pagina: number, totalPaginas: number): number {
  return Math.min(Math.max(1, totalPaginas), pagina + 1)
}

export function anteriorPagina(pagina: number): number {
  return Math.max(1, pagina - 1)
}

export function paginasVisibles(pagina: number, totalPaginas: number, ventana = 2): number[] {
  if (totalPaginas < 1) {
    return []
  }
  const actual = Math.min(Math.max(1, pagina), totalPaginas)
  let inicio = actual - ventana
  let fin = actual + ventana
  if (inicio < 1) {
    fin += 1 - inicio
    inicio = 1
  }
  if (fin > totalPaginas) {
    inicio -= fin - totalPaginas
    fin = totalPaginas
  }
  inicio = Math.max(1, inicio)
  const paginas: number[] = []
  for (let p = inicio; p <= fin; p++) {
    paginas.push(p)
  }
  return paginas
}
