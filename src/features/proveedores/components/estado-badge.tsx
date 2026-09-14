import type { CondicionProveedor } from '../data/types'

const ESTILOS: Record<CondicionProveedor, { contenedor: string; punto: string }> = {
  Habido: {
    contenedor: 'bg-green-100 text-green-800',
    punto: 'bg-green-600',
  },
  'No habido': {
    contenedor: 'bg-amber-100 text-amber-800',
    punto: 'bg-amber-600',
  },
  'No hallado': {
    contenedor: 'bg-red-100 text-red-800',
    punto: 'bg-red-600',
  },
  'En proceso de verificación': {
    contenedor: 'bg-blue-100 text-blue-800',
    punto: 'bg-blue-600',
  },
}

export function CondicionBadge({ condicion }: { condicion: CondicionProveedor }) {
  const estilos = ESTILOS[condicion]
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${estilos.contenedor}`}
    >
      <span
        aria-hidden="true"
        className={`size-1.5 rounded-full ${estilos.punto}`}
      />
      {condicion}
    </span>
  )
}