import { createFileRoute } from '@tanstack/react-router'
import { UserManagementPage } from '../features/user-management/components/user-management-page'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return <UserManagementPage />
}
