import { createFileRoute } from '@tanstack/react-router'
import { GestionarAlmacenesPage } from '@/modules/almacen/pages/gestionar-almacenes-page'

export const Route = createFileRoute('/')({
  component: GestionarAlmacenesPage,
})
