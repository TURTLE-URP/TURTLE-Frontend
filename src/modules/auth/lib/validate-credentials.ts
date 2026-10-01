export interface CredentialValidation {
  ok: boolean
  emailError?: string
  passwordError?: string
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MIN_PASSWORD_LENGTH = 6

export function validateCredentials(email: string, password: string): CredentialValidation {
  const trimmedEmail = email.trim()
  const emailError = !trimmedEmail
    ? 'Ingresa tu correo electrónico.'
    : EMAIL_PATTERN.test(trimmedEmail)
      ? undefined
      : 'El correo electrónico no es válido.'

  const passwordError = !password
    ? 'Ingresa tu contraseña.'
    : password.length < MIN_PASSWORD_LENGTH
      ? `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`
      : undefined

  return {
    ok: emailError === undefined && passwordError === undefined,
    emailError,
    passwordError,
  }
}
