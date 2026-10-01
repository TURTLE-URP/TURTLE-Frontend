import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/inventario')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/hola"!</div>
}
