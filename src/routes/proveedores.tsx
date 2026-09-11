import { createFileRoute } from '@tanstack/react-router'
import { SinAcceso } from '@/features/proveedores/components/sin-acceso'
import { getMockSesion } from '@/features/proveedores/data/mock-session'
import { puedeGestionarProveedores } from '@/features/proveedores/logic/access'

export const Route = createFileRoute('/proveedores')({
  component: ProveedoresRoute,
})

function ProveedoresRoute() {
  const sesion = getMockSesion()

  if (!puedeGestionarProveedores(sesion.rol)) {
    return <SinAcceso />
  }

  return (
    <section aria-labelledby="titulo-proveedores">
      <h1 id="titulo-proveedores" className="text-2xl font-bold text-foreground">
        Gestión de proveedores
      </h1>
      <p className="mt-2 text-muted-foreground">Módulo en construcción.</p>
    </section>
  )
}