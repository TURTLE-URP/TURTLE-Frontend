import { createFileRoute } from '@tanstack/react-router'
import { GestionarOrdenesAbasto } from '@/modules/abasto/pages/GestionarOrdenesAbasto'

export const Route = createFileRoute('/abasto')({
  component: GestionarOrdenesAbasto,
})
