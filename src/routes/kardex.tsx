import { createFileRoute } from '@tanstack/react-router'
import { InventoryKardexPage } from '@/modules/inventory-kardex/pages/inventory-kardex-page'

export const Route = createFileRoute('/kardex')({
  component: InventoryKardexPage,
})
