import { useId, useState, type FormEvent } from 'react'
import { Eye, EyeSlash, SignIn, SpinnerGap } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { AuthSession } from '../../../stores/auth-store'
import { validateCredentials } from '../logic/validate-credentials'

export interface LoginFormProps {
  onSuccess: (session: AuthSession) => void
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const emailId = useId()
  const passwordId = useId()
  const formErrorId = useId()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [emailError, setEmailError] = useState<string | undefined>()
  const [passwordError, setPasswordError] = useState<string | undefined>()
  const [formError, setFormError] = useState<string | undefined>()
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError(undefined)

    const validation = validateCredentials(email, password)
    setEmailError(validation.emailError)
    setPasswordError(validation.passwordError)
    if (!validation.ok) {
      return
    }

    setSubmitting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 450))
      onSuccess({
        email: email.trim().toLowerCase(),
        token: `demo-${crypto.randomUUID()}`,
      })
    } catch {
      setFormError('No se pudo iniciar sesión. Inténtalo de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8"
      aria-describedby={formError ? formErrorId : undefined}
    >
      <div className="space-y-5">
        <div className="space-y-2">
          <label htmlFor={emailId} className="block text-sm font-medium text-foreground">
            Correo electrónico
          </label>
          <Input
            id={emailId}
            name="email"
            type="email"
            autoComplete="username"
            placeholder="ana@empresa.com"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value)
              setEmailError(undefined)
            }}
            aria-invalid={emailError ? true : undefined}
            aria-describedby={emailError ? `${emailId}-error` : undefined}
          />
          {emailError ? (
            <p id={`${emailId}-error`} className="text-sm text-destructive">
              {emailError}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <label htmlFor={passwordId} className="block text-sm font-medium text-foreground">
              Contraseña
            </label>
            <span className="text-xs text-muted-foreground">Mínimo 6 caracteres</span>
          </div>
          <div className="relative">
            <Input
              id={passwordId}
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value)
                setPasswordError(undefined)
              }}
              aria-invalid={passwordError ? true : undefined}
              aria-describedby={passwordError ? `${passwordId}-error` : undefined}
              className="pr-11"
            />
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              className="absolute top-1/2 right-2 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-1 focus-visible:ring-ring/50 focus-visible:outline-none"
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {passwordError ? (
            <p id={`${passwordId}-error`} className="text-sm text-destructive">
              {passwordError}
            </p>
          ) : null}
        </div>
      </div>

      {formError ? (
        <p id={formErrorId} role="alert" className="mt-4 text-sm text-destructive">
          {formError}
        </p>
      ) : null}

      <Button
        type="submit"
        size="lg"
        disabled={submitting}
        className="mt-6 h-11 w-full rounded-xl text-sm font-semibold"
      >
        {submitting ? <SpinnerGap size={18} className="animate-spin" /> : <SignIn size={18} />}
        {submitting ? 'Ingresando…' : 'Iniciar sesión'}
      </Button>
    </form>
  )
}
