import { InventoryPage } from '@/modules/inventory-kardex/components/inventory-page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/inventario')({
  component: RouteComponent,
})

function RouteComponent() {
  return <InventoryPage />
}
