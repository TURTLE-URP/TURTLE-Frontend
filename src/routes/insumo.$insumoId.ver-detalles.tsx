import { createFileRoute } from '@tanstack/react-router'
import { InsumoDetallePage } from '@/modules/insumo/pages/InsumoDetallePage'

export const Route = createFileRoute('/insumo/$insumoId/ver-detalles')({
  component: InsumoDetalleRoute,
})

function InsumoDetalleRoute() {
  const { insumoId } = Route.useParams()
  return <InsumoDetallePage insumoId={insumoId} />
}
