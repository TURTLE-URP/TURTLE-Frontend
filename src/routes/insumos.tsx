import { createFileRoute } from '@tanstack/react-router'
import { InsumosPage } from '@/modules/insumo/pages/InsumosPage'

export const Route = createFileRoute('/insumos')({
  component: InsumosPage,
})
