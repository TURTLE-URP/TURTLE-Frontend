import { Button } from '@/shared/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/components/ui/tooltip'
import type { Cotizacion } from '../interfaces/types'
import { accionesDisponibles, type EstadoAccion } from '../lib/acciones'

interface RowActionsProps {
  cotizacion: Cotizacion
  onCerrar: (cotizacion: Cotizacion) => void
}

function AccionDeshabilitada({
  nombre,
  accion,
  children,
}: {
  nombre: string
  accion: EstadoAccion
  children: React.ReactNode
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span tabIndex={0} aria-label={`${nombre} (no disponible)`}>
          <Button type="button" variant="ghost" size="sm" disabled aria-describedby={undefined}>
            {children}
            {accion.motivo ? <span className="sr-only">{accion.motivo}</span> : null}
          </Button>
        </span>
      </TooltipTrigger>
      <TooltipContent>{accion.motivo}</TooltipContent>
    </Tooltip>
  )
}

export function RowActions({ cotizacion, onCerrar }: RowActionsProps) {
  const acciones = accionesDisponibles(cotizacion)

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex items-center justify-end gap-1">
        {acciones.cerrar.habilitada ? (
          <Button type="button" variant="ghost" size="sm" onClick={() => onCerrar(cotizacion)}>
            Cerrar cotización
          </Button>
        ) : (
          <AccionDeshabilitada nombre="Cerrar cotización" accion={acciones.cerrar}>
            Cerrar cotización
          </AccionDeshabilitada>
        )}
        {acciones.verOrden.habilitada && cotizacion.ordenCompraId ? (
          <Button type="button" variant="ghost" size="sm" asChild>
            <a
              href={`/ordenes-compra/${cotizacion.ordenCompraId}`}
              target="_blank"
              rel="noreferrer"
            >
              Ver Orden de Compra
            </a>
          </Button>
        ) : (
          <AccionDeshabilitada nombre="Ver Orden de Compra" accion={acciones.verOrden}>
            Ver Orden de Compra
          </AccionDeshabilitada>
        )}
        <Button type="button" variant="ghost" size="sm" asChild>
          <a href={`/cotizaciones/${cotizacion.id}`} target="_blank" rel="noreferrer">
            Ver detalles
          </a>
        </Button>
      </div>
    </TooltipProvider>
  )
}
