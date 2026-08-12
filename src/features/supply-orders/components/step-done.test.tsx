import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { StepDone } from './step-done'

const SEND_STATUS: Record<string, 'sent' | 'error'> = {
  'Molinos del Norte': 'sent',
  'Agro Fresh SAC': 'error',
}

describe('StepDone', () => {
  it('reports the number of emitted orders', () => {
    render(
      <StepDone
        orderCount={2}
        supplierNames={['Molinos del Norte', 'Agro Fresh SAC']}
        sendStatus={SEND_STATUS}
        onClose={vi.fn()}
      />,
    )
    expect(screen.getByText('2 órdenes emitidas')).toBeInTheDocument()
  })

  it('lists each supplier with its send status', () => {
    render(
      <StepDone
        orderCount={2}
        supplierNames={['Molinos del Norte', 'Agro Fresh SAC']}
        sendStatus={SEND_STATUS}
        onClose={vi.fn()}
      />,
    )
    expect(screen.getByText('Molinos del Norte')).toBeInTheDocument()
    expect(screen.getByText('Agro Fresh SAC')).toBeInTheDocument()
    expect(screen.getByText('Notificación enviada')).toBeInTheDocument()
    expect(screen.getByText('Error de envío')).toBeInTheDocument()
  })

  it('closes via the Volver button', async () => {
    const onClose = vi.fn()
    const user = userEvent.setup()
    render(
      <StepDone
        orderCount={1}
        supplierNames={['Molinos del Norte']}
        sendStatus={{}}
        onClose={onClose}
      />,
    )
    await user.click(screen.getByRole('button', { name: /volver a órdenes/i }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
