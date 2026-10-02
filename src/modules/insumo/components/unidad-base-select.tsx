import type { SelectHTMLAttributes } from 'react'
import { useUnidadesBase } from '../services/queries'
import { cn } from '@/shared/lib/utils'

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: string
}

/** Select de unidad base alimentado por GET /supplies/units/base. */
export function UnidadBaseSelect({ error, disabled, className, ...props }: Props) {
  const { data: unidades = [], isLoading } = useUnidadesBase()

  return (
    <div>
      <select
        disabled={disabled || isLoading}
        aria-invalid={!!error}
        className={cn(
          'mt-1 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
          className,
        )}
        {...props}
      >
        <option value="">{isLoading ? 'Cargando unidades…' : 'Selecciona unidad'}</option>
        {unidades.map((unidad) => (
          <option key={unidad.id} value={unidad.id}>
            {unidad.nombre} ({unidad.abreviatura})
          </option>
        ))}
      </select>
      {error ? <p className="text-[11px] text-red-500 mt-1">{error}</p> : null}
    </div>
  )
}
