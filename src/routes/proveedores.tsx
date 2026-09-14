import { createFileRoute } from '@tanstack/react-router'
import { SinAcceso } from '@/features/proveedores/components/sin-acceso'
import { getMockSesion } from '@/features/proveedores/data/mock-session'
import { puedeGestionarProveedores } from '@/features/proveedores/logic/access'
import { ProveedoresPage } from '@/features/proveedores/pages/proveedores-page'

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