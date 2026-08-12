import { createFileRoute, redirect } from '@tanstack/react-router'
import { requireAdmin, RoleAccessDeniedError } from '../features/supply-orders/logic/role'
import { SupplyOrdersPage } from '../features/supply-orders/components/supply-orders-page'

export const Route = createFileRoute('/abastecimiento')({
  beforeLoad: () => {
    try {
      requireAdmin()
    } catch (error) {
      if (error instanceof RoleAccessDeniedError) {
        throw redirect({ to: '/' })
      }
      throw error
    }
  },
  component: SupplyOrdersPage,
})
