export type EstadoSolicitud =
  | 'aprobada'
  | 'en negociación'
  | 'rechazada'

export interface Cotizacion {
  id: string
  folio: string
  proveedorNombre: string
  fecha: string
  solicitudId: string
  solicitudEstado: EstadoSolicitud
  total: number
  moneda: string
  ordenCompraId: string | null
}

export type FiltroEstado = 'todas' | EstadoSolicitud

export interface FiltrosCotizaciones {
  texto: string
  estado: FiltroEstado
  desde: string | null
  hasta: string | null
  pagina: number
  tamano: number
}

export interface ListadoCotizaciones {
  items: Cotizacion[]
  pagina: number
  tamano: number
  total: number
  totalPaginas: number
}
