import type { Insumo, KardexMovement, MovementType } from '../types'

/** Matches insumos by name or category, case-insensitively. */
export function filterInsumos(insumos: Insumo[], query: string): Insumo[] {
  const normalized = query.trim().toLowerCase()
  if (normalized === '') return insumos

  return insumos.filter(
    (insumo) =>
      insumo.nombre.toLowerCase().includes(normalized) ||
      insumo.categoria.toLowerCase().includes(normalized),
  )
}

export interface MovementFilters {
  /** Restrict to a single movement type; omit or 'todos' for no filter. */
  tipo?: MovementType | 'todos'
}

/**
 * Returns the Kardex entries for one insumo, most recent first, optionally
 * narrowed down by movement type.
 */
export function getMovementsForInsumo(
  movements: KardexMovement[],
  insumoId: string,
  filters: MovementFilters = {},
): KardexMovement[] {
  const tipo = filters.tipo ?? 'todos'

  return movements
    .filter((movement) => movement.insumoId === insumoId)
    .filter((movement) => tipo === 'todos' || movement.tipo === tipo)
    .sort((a, b) => b.fecha.localeCompare(a.fecha))
}
