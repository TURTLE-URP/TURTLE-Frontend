import type { EstadoSolicitud } from '../data/types'

const ESTILOS: Record<EstadoSolicitud, { contenedor: string; punto: string }> = {
  aprobada: {
    contenedor: 'bg-green-100 text-green-800',
    punto: 'bg-green-600',
  },
  'en negociación': {
    contenedor: 'bg-blue-100 text-blue-800',
    punto: 'bg-blue-600',
  },
  rechazada: {
    contenedor: 'bg-red-100 text-red-800',
    punto: 'bg-red-600',
  },
  pendiente: {
    contenedor: 'bg-amber-100 text-amber-800',
    punto: 'bg-amber-600',
  },
}

export function EstadoBadge({ estado }: { estado: EstadoSolicitud }) {
  const estilos = ESTILOS[estado]
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${estilos.contenedor}`}
    >
      <span aria-hidden="true" className={`size-1.5 rounded-full ${estilos.punto}`} />
      {estado}
    </span>
  )
}
