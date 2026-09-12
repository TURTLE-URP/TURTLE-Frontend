import type { EstadoProveedor } from '../data/types'

export function EstadoBadge({ estado }: { estado: EstadoProveedor }) {
  const activo = estado === 'Activo'
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${
        activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}
    >
      <span
        aria-hidden="true"
        className={`size-1.5 rounded-full ${activo ? 'bg-green-600' : 'bg-red-600'}`}
      />
      {estado}
    </span>
  )
}