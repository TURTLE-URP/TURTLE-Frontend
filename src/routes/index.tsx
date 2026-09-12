import { createFileRoute, Link } from '@tanstack/react-router'
import { CheckCircle } from '@phosphor-icons/react'
import { useAuthStore } from '../stores/auth-store'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const session = useAuthStore((state) => state.session)

  if (!session) {
    return (
      <section aria-labelledby="home-title" className="mx-auto w-full max-w-xl">
        <p className="text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
          Módulo · Inicio
        </p>
        <h1 id="home-title" className="mt-2 text-3xl font-bold tracking-tight text-foreground">
          Bienvenido a TURTLE
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Inicia sesión para entrar al sistema.
        </p>
        <Link
          to="/login"
          className="mt-8 inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Ir a iniciar sesión
        </Link>
      </section>
    )
  }

  return (
    <section aria-labelledby="home-title" className="mx-auto w-full max-w-xl">
      <p className="text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
        Módulo · Sesión
      </p>
      <h1 id="home-title" className="mt-2 text-3xl font-bold tracking-tight text-foreground">
        Sesión iniciada
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Ya ingresaste al sistema TURTLE. Esta pantalla confirma que el login funcionó.
      </p>

      <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <CheckCircle size={28} className="mt-0.5 text-secondary" weight="fill" />
          <div>
            <p className="text-base font-semibold text-foreground">Login correcto</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Cuenta activa: <span className="font-medium text-foreground">{session.email}</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
