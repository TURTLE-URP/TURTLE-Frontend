import type { Cotizacion, EstadoSolicitud } from '../interfaces/types'

export interface EstadoAccion {
  habilitada: boolean
  motivo?: string
}

export interface AccionesCotizacion {
  cerrar: EstadoAccion
  verOrden: EstadoAccion
  verDetalle: EstadoAccion
}

const CERRAR_SOLO_NEGOCIACION: EstadoSolicitud = 'en negociación'

export function accionesDisponibles(cotizacion: Cotizacion): AccionesCotizacion {
  const enNegociacion = cotizacion.solicitudEstado === CERRAR_SOLO_NEGOCIACION
  const aprobada = cotizacion.solicitudEstado === 'aprobada'
  return {
    cerrar: enNegociacion
      ? { habilitada: true }
      : {
          habilitada: false,
          motivo: 'Disponible solo si la solicitud está en negociación.',
        },
    verOrden: aprobada
      ? { habilitada: true }
      : {
          habilitada: false,
          motivo: 'Disponible solo si la solicitud está aprobada.',
        },
    verDetalle: { habilitada: true },
  }
}
