import { createFileRoute } from '@tanstack/react-router'
import { SupplyOrdersPage } from '../features/supply-orders/components/supply-orders-page'

export const Route = createFileRoute('/abastecimiento')({
  component: SupplyOrdersPage,
})