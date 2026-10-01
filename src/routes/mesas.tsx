import { createFileRoute } from '@tanstack/react-router'
import { GestionMesas } from '@/modules/mesas/pages/GestionMesas'

export const Route = createFileRoute('/mesas')({
  component: GestionMesas,
})
