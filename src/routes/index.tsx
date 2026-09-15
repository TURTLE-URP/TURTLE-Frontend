import { createFileRoute } from '@tanstack/react-router'
import { GestionarAlmacenesPage } from '../features/almacen/components/gestionar-almacenes-page'

export const Route = createFileRoute('/')({
  component: GestionarAlmacenesPage,
})
