import { MockProveedoresRepository } from '../lib/mock-proveedores-repository'
import type {
  DatosFiscales,
  FiltrosProveedores,
  ListadoProveedores,
  Proveedor,
  ProveedorInput,
} from '../interfaces/types'

export type ErrorCode =
  | 'RUC_DUPLICADO'
  | 'VALIDACION'
  | 'NO_ENCONTRADO'
  | 'TRANSICION_INVALIDA'
  | 'ERROR_INTERNO'

export class ProveedoresError extends Error {
  readonly code: ErrorCode

  constructor(code: ErrorCode, message: string) {
    super(message)
    this.name = 'ProveedoresError'
    this.code = code
  }
}

export class RucDuplicadoError extends ProveedoresError {
  constructor() {
    super('RUC_DUPLICADO', 'El RUC ya se encuentra registrado en el sistema.')
    this.name = 'RucDuplicadoError'
  }
}

export class ProveedorNoEncontradoError extends ProveedoresError {
  constructor() {
    super('NO_ENCONTRADO', 'No se encontró el proveedor solicitado.')
    this.name = 'ProveedorNoEncontradoError'
  }
}

export interface ProveedoresRepository {
  listar(filtros: FiltrosProveedores): Promise<ListadoProveedores>
  getDatosFiscales(ruc: string): Promise<DatosFiscales>
  crear(input: ProveedorInput): Promise<Proveedor>
  actualizar(id: string, input: ProveedorInput): Promise<Proveedor>
  eliminar(id: string): Promise<void>
}

export function createProveedoresRepository(): ProveedoresRepository {
  const baseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim() ?? ''
  if (baseUrl) {
    // El adapter HTTP de proveedores aún no existe: se sigue usando el mock
    // para no romper el resto de la app (ej. detalle-insumo) cuando se
    // configura VITE_API_BASE_URL para las features que ya usan API real.
    console.warn(
      '[proveedores] Adapter HTTP no implementado todavía: usando mock aunque VITE_API_BASE_URL esté configurado.',
    )
  }
  return new MockProveedoresRepository()
}