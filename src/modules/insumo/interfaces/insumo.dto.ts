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
// Medidas: POST /supplies/{id}/medidas, PATCH/DELETE /supplies/{id}/medidas/{medidaId}
// ---------------------------------------------------------------------------

export type UsoMedidaDto = 'todo' | 'receta' | 'productos_proveedor'

export interface CreateMedidaDto {
  nombre: string
  abreviatura: string
  factor_a_base: number
  uso?: UsoMedidaDto
}

export interface UpdateMedidaDto {
  nombre?: string
  abreviatura?: string
  factor_a_base?: number
  uso?: UsoMedidaDto
}

export interface MedidaResponseEntity {
  id: number
  nombre: string
  abreviatura: string
  factorABase: number
  uso?: UsoMedidaDto | null
}

export interface MedidaDeletedEntity {
  id: number
  message: string
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

export interface AlertaGlobalResponseEntity {
  id: number
  stockMin: number
  stockDeseado?: number | null
}

export interface AlertaAlmacenResponseEntity {
  id: number
  idAlmacen: number
  codigoAlmacen: string
  nombreAlmacen: string
  minimoAlerta: number
  cantidadReponer?: number | null
}

export interface SupplyAlertasResponseEntity {
  global: AlertaGlobalResponseEntity | null
  porAlmacen: AlertaAlmacenResponseEntity[]
}

export interface AlertaDeletedEntity {
  idInsumo: number
  idAlmacen?: number | null
  message: string
}

export type CriterioEliminable = 'stock_en_cero' | 'sin_ordenes_pendientes' | 'sin_recetas_activas'

export interface CriterioEliminableEntity {
  criterio: CriterioEliminable
  cumple: boolean
  detalle: string
}

export interface EliminableResponseEntity {
  idInsumo: number
  codigo: string
  nombre: string
  eliminable: boolean
  criterios: CriterioEliminableEntity[]
}


