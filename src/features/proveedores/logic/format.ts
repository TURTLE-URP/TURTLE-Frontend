import type { EstadoProveedor } from '../data/types'

const FORMATO_FECHA = new Intl.DateTimeFormat('es-PE', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

export function formatearFecha(iso: string): string {
  const fecha = new Date(iso)
  if (Number.isNaN(fecha.getTime())) {
    return '—'
  }
  return FORMATO_FECHA.format(fecha)
}

export function etiquetaEstado(estado: EstadoProveedor): string {
  return estado
}