import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { LoginForm } from './login-form'

describe('LoginForm', () => {
  it('shows validation errors when submitted empty', async () => {
    const user = userEvent.setup()
    render(<LoginForm onSuccess={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: 'Iniciar sesión' }))

    expect(await screen.findByText(/ingresa tu correo/i)).toBeInTheDocument()
    expect(screen.getByText(/ingresa tu contraseña/i)).toBeInTheDocument()
  })

  it('calls onSuccess with a normalized email when valid', async () => {
    const user = userEvent.setup()
    const onSuccess = vi.fn()
    render(<LoginForm onSuccess={onSuccess} />)

    await user.type(screen.getByLabelText(/correo electrónico/i), 'Ana@Turtle.pe')
    await user.type(screen.getByLabelText(/^contraseña$/i), 'secret1')
    await user.click(screen.getByRole('button', { name: 'Iniciar sesión' }))

    await vi.waitFor(() => {
      expect(onSuccess).toHaveBeenCalledTimes(1)
    })
    expect(onSuccess.mock.calls[0][0].email).toBe('ana@turtle.pe')
    expect(onSuccess.mock.calls[0][0].token).toMatch(/^demo-/)
  })
})
