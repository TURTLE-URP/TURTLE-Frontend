import { createFileRoute } from '@tanstack/react-router'
import { SinAcceso } from '@/modules/proveedores/components/sin-acceso'
import { getMockSesion } from '@/modules/proveedores/lib/mock-session'
import { puedeGestionarProveedores } from '@/modules/proveedores/lib/access'
import { ProveedoresPage } from '@/modules/proveedores/pages/proveedores-page'

export const Route = createFileRoute('/proveedores')({
  component: ProveedoresRoute,
})

export function ProveedoresRoute() {
  const sesion = getMockSesion()

  if (!puedeGestionarProveedores(sesion.rol)) {
    return <SinAcceso />
  }

  return <ProveedoresPage />
}