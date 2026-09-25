import type { MovementType } from '../types'

const TYPE_LABELS: Record<MovementType, string> = {
  entrada: 'Entrada',
  salida: 'Salida',
  merma: 'Merma',
}

const TYPE_BADGE_VARIANTS: Record<MovementType, 'secondary' | 'default' | 'destructive'> = {
  entrada: 'secondary',
  salida: 'default',
  merma: 'destructive',
}

/** Human-readable, Spanish label for a movement type. */
export function movementTypeLabel(type: MovementType): string {
  return TYPE_LABELS[type]
}

/** Badge color: green for stock coming in, blue for going out, red for waste. */
export function movementTypeBadgeVariant(
  type: MovementType,
): 'secondary' | 'default' | 'destructive' {
  return TYPE_BADGE_VARIANTS[type]
}

/** Sign to apply to `cantidad` when explaining a movement's effect on stock. */
export function movementTypeSign(type: MovementType): 1 | -1 {
  return type === 'entrada' ? 1 : -1
}

/** Options for populating a movement-type filter <select>. */
export const MOVEMENT_TYPE_OPTIONS: Array<{ value: MovementType; label: string }> = (
  Object.keys(TYPE_LABELS) as MovementType[]
).map((value) => ({ value, label: TYPE_LABELS[value] }))
