import { createRootRoute, Link, Outlet, useLocation, useRouterState } from '@tanstack/react-router'
import { ErrorBoundary } from '../app/error-boundary'
import { ToastRegion } from '../features/proveedores/components/toast'
import { getMockSesion } from '../features/proveedores/data/mock-session'
import { puedeGestionarProveedores } from '../features/proveedores/logic/access'
import { useAppStore } from '../stores/app-store'
import { useAuthStore } from '../stores/auth-store'

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  const appName = useAppStore((state) => state.appName)
  const location = useLocation()
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const session = useAuthStore((state) => state.session)
  const signOut = useAuthStore((state) => state.signOut)
  const isMesasPage = location.pathname === '/mesas'
  const isLogin = pathname === '/login'
  if (isMesasPage) {
    return (
      <ErrorBoundary>
        <Outlet />
      </ErrorBoundary>
    )
  }


  return (
    <ErrorBoundary>
      <div className="flex min-h-screen flex-col bg-background">
        <header className="border-b border-border bg-background">
          <nav
            aria-label="Main navigation"
            className="mx-auto flex h-16 w-full max-w-5xl items-center gap-6 px-4"
          >
            <Link to="/" className="text-base font-semibold tracking-tight text-foreground">
              {appName}
            </Link>
            <Link
              to="/usuarios"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Usuarios
            </Link>
            {puedeGestionarProveedores(getMockSesion().rol) && (
              <Link
                to="/proveedores"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Proveedores
              </Link>
            )}
            {isLogin ? null : session ? (
              <div className="ml-auto flex items-center gap-3">
                <span className="hidden text-sm text-muted-foreground sm:inline">{session.email}</span>
                <button
                  type="button"
                  onClick={() => signOut()}
                  className="rounded-full bg-foreground px-3 py-1.5 text-xs font-medium text-background transition-opacity hover:opacity-80 focus-visible:ring-1 focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  Cerrar sesión
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="ml-auto rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90 focus-visible:ring-1 focus-visible:ring-ring/50 focus-visible:outline-none"
              >
                Iniciar sesión
              </Link>
            )}
          </nav>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
          <Outlet />
        </main>
        <footer className="border-t border-border py-4 text-center text-sm text-muted-foreground">
          {appName} — Turtle Sistema de Restaurante
        </footer>
        <ToastRegion />
      </div>
    </ErrorBoundary>
  )
}
