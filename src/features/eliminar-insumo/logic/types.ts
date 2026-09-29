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
 * Datos mínimos que el modal necesita del insumo. A propósito no se importa
 * el tipo `Insumo` de la feature gestionar-insumos: cualquier objeto que
 * tenga estos 3 campos sirve, así el modal no depende de esa otra feature.
 */
export interface InsumoAEliminar {
  id: string
  codigo: string
  nombre: string
}