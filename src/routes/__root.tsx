import { createRootRoute, Outlet, useLocation } from '@tanstack/react-router'
import { ErrorBoundary } from '../app/error-boundary'
import { AppSidebar } from '../components/layout/app-sidebar'
import { ToastRegion } from '../features/proveedores/components/toast'

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  const { pathname } = useLocation()
  const isLogin = pathname === '/login'

  if (isLogin) {
    return (
      <ErrorBoundary>
        <div className="flex min-h-screen flex-col bg-background">
          <main className="mx-auto w-full max-w-xl flex-1 p-6 md:p-8">
            <Outlet />
          </main>
          <ToastRegion />
        </div>
      </ErrorBoundary>
    )
  }

  return (
    <ErrorBoundary>
      <div className="flex h-screen overflow-hidden bg-background">
        <AppSidebar />
        <main className="min-w-0 flex-1 overflow-y-auto p-6 md:p-8">
          <Outlet />
        </main>
        <ToastRegion />
      </div>
    </ErrorBoundary>
  )
}
