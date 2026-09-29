import { createFileRoute } from '@tanstack/react-router'
import { DetalleInsumoPage } from '@/features/detalle-insumo/components/detalle-insumo.page'

export const Route = createFileRoute('/detalle-insumo/$insumoId')({
  component: DetalleInsumoRoute,
})

function DetalleInsumoRoute() {
  const { insumoId } = Route.useParams()
  return <DetalleInsumoPage insumoId={insumoId} />
}
