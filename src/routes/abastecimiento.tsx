import { createFileRoute } from '@tanstack/react-router'
import { SupplyOrdersPage } from '@/modules/supply-orders/pages/supply-orders-page'

export const Route = createFileRoute('/abastecimiento')({
  component: SupplyOrdersPage,
})