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
