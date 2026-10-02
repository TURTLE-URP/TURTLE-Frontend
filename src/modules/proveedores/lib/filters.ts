export const TAMANO_PAGINA = 10

export interface Filtros {
  texto: string
  pagina: number
  tamano: number
}

export function crearFiltros(texto: string, pagina: number, tamano = TAMANO_PAGINA): Filtros {
  return { texto: texto.trim(), pagina: Math.max(1, pagina), tamano }
}

export function siguientePagina(pagina: number, totalPaginas: number): number {
  return Math.min(totalPaginas, pagina + 1)
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