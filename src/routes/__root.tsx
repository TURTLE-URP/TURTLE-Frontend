import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { ErrorBoundary } from '../app/error-boundary'
import { ToastRegion } from '../features/proveedores/components/toast'
import { getMockSesion } from '../features/proveedores/data/mock-session'
import { puedeGestionarProveedores } from '../features/proveedores/logic/access'
import { useAppStore } from '../stores/app-store'

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  const appName = useAppStore((state) => state.appName)

  return (
    <ErrorBoundary>
      <div className="flex min-h-screen flex-col">
        <header className="border-b border-border bg-background">
          <nav
            aria-label="Main navigation"
            className="mx-auto flex h-16 w-full max-w-5xl items-center gap-6 px-4"
          >
            <a href="/" className="font-semibold text-foreground">
              {appName}
            </a>
            {puedeGestionarProveedores(getMockSesion().rol) && (
              <Link
                to="/proveedores"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Proveedores
              </Link>
            )}
          </nav>
        </header>
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
          <Outlet />
        </main>
        <footer className="border-t border-border py-4 text-center text-sm text-muted-foreground">
          {appName} — Vite + React SPA
        </footer>
        <ToastRegion />
      </div>
    </ErrorBoundary>
  )
}
