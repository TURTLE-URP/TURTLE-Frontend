import { createFileRoute } from '@tanstack/react-router'
import { GestionarOrdenesAbasto } from '../features/abasto/GestionarOrdenesAbasto'

export const Route = createFileRoute('/abasto')({
  component: GestionarOrdenesAbasto,
})
