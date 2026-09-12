import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { LoginForm } from '../features/auth/components/login-form'
import { useAuthStore } from '../stores/auth-store'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const session = useAuthStore((state) => state.session)
  const signIn = useAuthStore((state) => state.signIn)

  useEffect(() => {
    if (session) {
      void navigate({ to: '/' })
    }
  }, [navigate, session])

  return (
    <section aria-labelledby="login-title" className="mx-auto w-full max-w-xl">
      <p className="text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
        Módulo · Acceso
      </p>
      <h1 id="login-title" className="mt-2 text-3xl font-bold tracking-tight text-foreground">
        Iniciar sesión
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Accede a tu cuenta para gestionar órdenes, inventario y el resto del sistema TURTLE.
      </p>

      <div className="mt-8">
        <LoginForm
          onSuccess={(nextSession) => {
            signIn(nextSession)
            void navigate({ to: '/' })
          }}
        />
      </div>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        Entorno de demostración: usa cualquier correo válido y una contraseña de 6 o más
        caracteres.
      </p>
    </section>
  )
}
