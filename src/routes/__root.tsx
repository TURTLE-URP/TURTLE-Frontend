import { createRootRoute, Link, Outlet, useRouterState } from '@tanstack/react-router'
import { ErrorBoundary } from '../app/error-boundary'
import { useAppStore } from '../stores/app-store'
import { useAuthStore } from '../stores/auth-store'

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  const appName = useAppStore((state) => state.appName)
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const session = useAuthStore((state) => state.session)
  const signOut = useAuthStore((state) => state.signOut)
  const isLogin = pathname === '/login'

  return (
    <ErrorBoundary>
      <div className="flex min-h-screen flex-col bg-background">
        <header className="border-b border-border bg-background">
          <nav
            aria-label="Navegación principal"
            className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4"
          >
            <Link to="/" className="text-base font-semibold tracking-tight text-foreground">
              {appName}
            </Link>
            {isLogin ? null : session ? (
              <div className="flex items-center gap-3">
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
                className="rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90 focus-visible:ring-1 focus-visible:ring-ring/50 focus-visible:outline-none"
              >
                Iniciar sesión
              </Link>
            )}
          </nav>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
          <Outlet />
        </main>
      </div>
    </ErrorBoundary>
  )
}
