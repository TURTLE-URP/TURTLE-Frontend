/**
 * DTOs espejo del Swagger del backend (NestJS).
 * Nombres y campos idénticos a los schemas del OpenAPI.
 */

// ---------------------------------------------------------------------------
// Supplies: POST /supplies — el backend genera el código (folio)
// ---------------------------------------------------------------------------

export interface CreateSupplyDto {
  nombre: string
  descripcion?: string
  id_unidad_base: number
}

// ---------------------------------------------------------------------------
// Supplies: PATCH /supplies/{id}
// ---------------------------------------------------------------------------

export interface UpdateSupplyDto {
  nombre?: string
  descripcion?: string
  id_unidad_base?: number
}

// ---------------------------------------------------------------------------
// Medidas: POST /supplies/{id}/medidas
// ---------------------------------------------------------------------------

export type UsoMedidaDto = 'todo' | 'receta' | 'productos_proveedor'

export interface CreateMedidaDto {
  nombre: string
  abreviatura: string
  factor_a_base: number
  uso?: UsoMedidaDto
}

// ---------------------------------------------------------------------------
// Alertas: PUT /supplies/{id}/alertas/global
// ---------------------------------------------------------------------------

export interface UpsertAlertaGlobalDto {
  stock_min: number
  usuario_id: number
  stock_deseado?: number
}

// ---------------------------------------------------------------------------
// Alertas: PUT /supplies/{id}/alertas/almacen
// ---------------------------------------------------------------------------

export interface UpsertAlertaAlmacenDto {
  id_almacen: number
  minimo_alerta: number
  usuario_id: number
  cantidad_reponer?: number
}

// ---------------------------------------------------------------------------
// Respuestas (espejo de las entities del Swagger)
// ---------------------------------------------------------------------------

export interface SupplyUnitResponseEntity {
  id: number
  abreviatura: string
  nombre: string
}

export interface SupplyResponseEntity {
  id: number
  codigo: string
  nombre: string
  descripcion: string | null
  unidadBase: SupplyUnitResponseEntity
  stockActual: number
}

export interface PaginatedSuppliesResponse {
  data: SupplyResponseEntity[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface SupplyDeletedEntity {
  id: number
  message: string
}

/** Respuestas sin schema en el Swagger: tipado defensivo. */
export type SupplyResponse = Record<string, unknown> & Partial<SupplyResponseEntity> & {
  unidad_medida?: string
  unidadMedida?: string
  unidad?: string
  stock_actual?: number
  stockActual?: number
  estado?: string
  activo?: boolean
}

export type MedidaResponse = Record<string, unknown> & {
  id?: number | string
  nombre?: string
  abreviatura?: string
  factor_a_base?: number | string
  factorABase?: number | string
  uso?: string
}

export interface CriterioEliminableResponse {
  criterio: string
  cumple: boolean
  detalle: string
}

export type EliminableResponse = Record<string, unknown> & {
  id_insumo?: number
  codigo?: string
  nombre?: string
  eliminable?: boolean
  criterios?: CriterioEliminableResponse[]
}

export type AlertaGlobalResponse = Record<string, unknown> & {
  stock_min?: number
  stockMin?: number
  minimo?: number
  stock_deseado?: number | null
  stockDeseado?: number | null
  cantidad_reponer?: number | null
  cantidadAReponer?: number | null
}

export type AlertaAlmacenResponse = Record<string, unknown> & {
  id_almacen?: number
  almacenId?: number
  id?: number
  minimo_alerta?: number
  minimo?: number
  cantidad_reponer?: number | null
  cantidadAReponer?: number | null
}

export type AlertasResponse = Record<string, unknown> & {
  global?: AlertaGlobalResponse | null
  porAlmacen?: AlertaAlmacenResponse[]
  por_almacen?: AlertaAlmacenResponse[]
  almacenes?: AlertaAlmacenResponse[]
  alertas?: AlertaAlmacenResponse[]
}
