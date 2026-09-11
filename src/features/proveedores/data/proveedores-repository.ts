import { MockProveedoresRepository } from './mock-proveedores-repository'
import type {
  DatosFiscales,
  EstadoProveedor,
  FiltrosProveedores,
  ListadoProveedores,
  Proveedor,
  ProveedorInput,
} from './types'

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
  cambiarEstado(id: string, estado: EstadoProveedor): Promise<Proveedor>
}

export function createProveedoresRepository(): ProveedoresRepository {
  const baseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim() ?? ''
  if (baseUrl) {
    throw new Error(
      'El adapter HTTP no está implementado todavía: deja VITE_API_BASE_URL vacío para usar el mock.',
    )
  }
  return new MockProveedoresRepository()
}