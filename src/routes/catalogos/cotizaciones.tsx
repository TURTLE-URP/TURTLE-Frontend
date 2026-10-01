import { createFileRoute } from '@tanstack/react-router'
import { SinAcceso } from '@/modules/cotizaciones/components/sin-acceso'
import { getMockSesion } from '@/modules/cotizaciones/lib/mock-session'
import { puedeVerCotizaciones } from '@/modules/cotizaciones/lib/access'
import { CotizacionesPage } from '@/modules/cotizaciones/pages/cotizaciones-page'

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
