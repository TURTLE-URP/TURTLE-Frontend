import { createFileRoute } from '@tanstack/react-router'
import { InventoryKardexPage } from '../features/inventory-kardex/components/inventory-kardex-page'

export const Route = createFileRoute('/kardex')({
  component: InventoryKardexPage,
})
