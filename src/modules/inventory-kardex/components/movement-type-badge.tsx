import { ArrowLineDownIcon, ArrowLineUpIcon, WarningCircleIcon } from '@phosphor-icons/react'
import { Badge } from '@/shared/components/ui/badge'
import { movementTypeBadgeVariant, movementTypeLabel } from '../lib/movement-type'
import type { MovementType } from '../interfaces/types'

const TYPE_ICONS: Record<MovementType, typeof ArrowLineDownIcon> = {
  entrada: ArrowLineDownIcon,
  salida: ArrowLineUpIcon,
  merma: WarningCircleIcon,
}

export interface MovementTypeBadgeProps {
  type: MovementType
}

/** Colored pill with an icon identifying a Kardex movement as entrada/salida/merma. */
export function MovementTypeBadge({ type }: MovementTypeBadgeProps) {
  const Icon = TYPE_ICONS[type]
  return (
    <Badge variant={movementTypeBadgeVariant(type)}>
      <Icon weight="bold" />
      {movementTypeLabel(type)}
    </Badge>
  )
}
