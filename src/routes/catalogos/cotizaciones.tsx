import { createFileRoute } from '@tanstack/react-router'
import { SinAcceso } from '@/features/cotizaciones/components/sin-acceso'
import { getMockSesion } from '@/features/cotizaciones/data/mock-session'
import { puedeVerCotizaciones } from '@/features/cotizaciones/logic/access'
import { CotizacionesPage } from '@/features/cotizaciones/pages/cotizaciones-page'

export const Route = createFileRoute('/catalogos/cotizaciones')({
  component: CotizacionesRoute,
})

export function CotizacionesRoute() {
  const sesion = getMockSesion()

  if (!puedeVerCotizaciones(sesion.rol)) {
    return <SinAcceso />
  }

  return <CotizacionesPage />
}
