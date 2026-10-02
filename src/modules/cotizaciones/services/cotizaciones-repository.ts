import { MockCotizacionesRepository } from '../lib/mock-cotizaciones-repository'
import type { FiltrosCotizaciones, ListadoCotizaciones } from '../interfaces/types'

export type ErrorCode = 'VALIDACION' | 'NO_ENCONTRADO' | 'ERROR_INTERNO'

export class CotizacionesError extends Error {
  readonly code: ErrorCode

  constructor(code: ErrorCode, message: string) {
    super(message)
    this.name = 'CotizacionesError'
    this.code = code
  }
}

export interface CotizacionesRepository {
  listar(filtros: FiltrosCotizaciones): Promise<ListadoCotizaciones>
}

export function createCotizacionesRepository(): CotizacionesRepository {
  const baseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim() ?? ''
  if (baseUrl) {
    // throw new Error(
    //   'El adapter HTTP no está implementado todavía: deja VITE_API_BASE_URL vacío para usar el mock.',
    // )
  }
  return new MockCotizacionesRepository()
}
