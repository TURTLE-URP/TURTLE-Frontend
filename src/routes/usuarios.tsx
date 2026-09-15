import { createFileRoute } from '@tanstack/react-router'
import { UserManagementPage } from '../features/user-management/components/user-management-page'

export const Route = createFileRoute('/usuarios')({
  component: UserManagementPage,
})
