import { createFileRoute } from '@tanstack/react-router'
import { GestionMesas } from '../features/mesas/GestionMesas'

export const Route = createFileRoute('/mesas')({
  component: GestionMesas,
})
