// Tipos de listar / registrar / editar (antes gestionar-insumos)
export type CategoriaInsumo =
  | 'Mariscos'
  | 'Pescados'
  | 'Verduras'
  | 'Condimentos'
  | 'Bebidas'
  | 'Envases'
  | 'Abarrotes'

export type EstadoInsumo = 'Activo' | 'Inactivo'

export type NivelStock = 'OK' | 'Bajo' | 'Critico'

export interface Insumo {
  id: string
  codigo: string
  nombre: string
  descripcion: string
  categorias: CategoriaInsumo[]
  unidadMedida: string
  stockActual: number
  stockMinimo: number
  stockAbasto: number
  estado: EstadoInsumo
  nivelStock: NivelStock
  imagenUrl?: string
}

export interface InsumoFiltros {
  busqueda: string
  categoria: CategoriaInsumo | 'Todos'
  estadoStock: NivelStock | 'Todos'
  estado: EstadoInsumo | 'Todos'
}

export interface KpiInsumos {
  total: number
  activos: number
  stockBajo: number
  criticos: number
}

// Tipos de ver detalle (antes detalle-insumo)
export interface InsumoDetalle {
  id: string
  codigo: string
  nombre: string
  descripcion?: string
  categoria: string
  unidadMedida: string
  stockActual: number
  stockMinimo: number
  estado: 'Activo' | 'Inactivo'
}

export type UsoMedidaApi = 'todo' | 'receta' | 'productos_proveedor'

export interface MedidaAlterna {
  id: string
  nombre: string
  abreviatura: string
  /** Cuántas unidades base equivale 1 unidad de esta medida (ej. 1 taza = 0.25 kg). Admite decimales > 0. */
  factorABase: number
  uso: string
  /** La fila "Kilogramo" (factor 1) es la medida base: no se edita ni se elimina */
  esBase?: boolean
}

export interface CrearMedidaInput {
  nombre: string
  abreviatura: string
  factorABase: number
  uso: UsoMedidaApi
}

/** 'GLOBAL' o el código de un almacén, ej. 'ALM-005' */
export type AlcanceAlerta = string

export interface AlertaStock {
  id: string
  alcance: AlcanceAlerta
  minimo: number
  cantidadAReponer?: number
  /** Presente solo en alertas por almacén: id numérico para DELETE /alertas/almacen/{almacenId} */
  idAlmacen?: number
  /** true cuando es la alerta global (PUT/DELETE /alertas/global) */
  esGlobal?: boolean
}

export interface UpsertAlertaGlobalInput {
  minimo: number
  cantidadAReponer?: number
}

export interface UpsertAlertaAlmacenInput {
  idAlmacen: number
  minimo: number
  cantidadAReponer?: number
}

/** Forma real de GET /supplies/{id}/eliminable (ver ejemplo del backend). */
export interface CriterioEliminableApi {
  criterio: string
  cumple: boolean
  detalle: string
}

export interface EliminableApi {
  id_insumo: number
  codigo: string
  nombre: string
  eliminable: boolean
  criterios: CriterioEliminableApi[]
}

// Tipos de eliminar (antes eliminar-insumo)
export interface CriterioEliminacion {
  id: string
  titulo: string
  /** true = el criterio se cumple (no bloquea), false = bloquea la eliminación */
  cumple: boolean
  detalle?: string
}

export interface EvaluacionEliminarInsumo {
  insumoId: string
  stockTotal: number
  numAlmacenes: number
  criterios: CriterioEliminacion[]
}

/**
 * Resumen del insumo para el encabezado del modal, jalado de
 * `GET /supplies/{id}`.
 */
export interface InsumoResumenDelete {
  codigo: string
  nombre: string
  stockTotal: number
  numAlmacenes: number
  unidad: string
}

/**
 * Datos mínimos que el modal necesita del insumo: cualquier objeto que
 * tenga estos 3 campos sirve.
 */
export interface InsumoAEliminar {
  id: string
  codigo: string
  nombre: string
}
