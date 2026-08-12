import { render, screen, within, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, expect, it, vi } from 'vitest'
import { WizardModal } from './wizard-modal'

function renderModal() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const onOpenChange = vi.fn()
  render(
    <QueryClientProvider client={client}>
      <WizardModal open onOpenChange={onOpenChange} />
    </QueryClientProvider>,
  )
  return { onOpenChange }
}

describe('WizardModal', () => {
  it('opens as a labeled dialog with the four-step progress indicator', async () => {
    renderModal()
    const dialog = await screen.findByRole('dialog', { name: /emitir orden de abastecimiento/i })
    for (const label of ['Modalidad', 'Configurar', 'Asignar', 'Resumen']) {
      expect(within(dialog).getByText(label)).toBeInTheDocument()
    }
  })

  it('moves focus inside the dialog on open', async () => {
    renderModal()
    await screen.findByRole('dialog')
    expect(document.activeElement?.closest('[role="dialog"]')).not.toBeNull()
  })

  it('requests dismissal on Escape', async () => {
    const { onOpenChange } = renderModal()
    const user = userEvent.setup()
    await screen.findByRole('dialog')
    await user.keyboard('{Escape}')
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('requests dismissal through the close button', async () => {
    const { onOpenChange } = renderModal()
    const user = userEvent.setup()
    await screen.findByRole('dialog')
    await user.click(screen.getByRole('button', { name: 'Cerrar' }))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('runs the full abasto libre flow through the done step', async () => {
    const user = userEvent.setup()
    renderModal()
    const dialog = await screen.findByRole('dialog')

    await user.click(within(dialog).getByRole('button', { name: /abasto libre/i }))
    expect(within(dialog).getByText('Configurar')).toBeInTheDocument()

    await user.type(within(dialog).getByRole('spinbutton', { name: /cantidad de harina/i }), '5')
    await waitFor(() =>
      expect(within(dialog).getByRole('button', { name: /continuar/i })).toBeEnabled(),
    )
    await user.click(within(dialog).getByRole('button', { name: /continuar/i }))

    await waitFor(() => expect(within(dialog).getByRole('radiogroup')).toBeInTheDocument())
    await user.click(within(dialog).getAllByRole('radio')[0])
    await waitFor(() =>
      expect(within(dialog).getByRole('button', { name: /ver resumen/i })).toBeEnabled(),
    )
    await user.click(within(dialog).getByRole('button', { name: /ver resumen/i }))

    await waitFor(() => expect(within(dialog).getByText('Resumen de órdenes')).toBeInTheDocument())
    expect(within(dialog).getByText('Molinos del Norte')).toBeInTheDocument()
    expect(within(dialog).getAllByText('S/ 292.50').length).toBeGreaterThan(0)

    await user.click(within(dialog).getByRole('button', { name: /confirmar y emitir/i }))

    await waitFor(() => expect(within(dialog).getByText(/orden emitida/i)).toBeInTheDocument())
    expect(within(dialog).getByText('Molinos del Norte')).toBeInTheDocument()
    expect(within(dialog).getByText('Notificación enviada')).toBeInTheDocument()
  })

  it('runs the full escasez flow with backend-computed quantities', async () => {
    const user = userEvent.setup()
    renderModal()
    const dialog = await screen.findByRole('dialog')

    await user.click(within(dialog).getByRole('button', { name: /por escasez/i }))
    await waitFor(() => expect(within(dialog).getByText('Insumos en escasez')).toBeInTheDocument())
    expect(within(dialog).getByText('Harina de trigo')).toBeInTheDocument()
    expect(within(dialog).getByText('17 kg')).toBeInTheDocument()

    await user.click(within(dialog).getByRole('button', { name: /continuar/i }))

    await waitFor(() => expect(within(dialog).getAllByRole('radiogroup')).toHaveLength(8))
    for (const group of within(dialog).getAllByRole('radiogroup')) {
      await user.click(within(group).getAllByRole('radio')[0])
    }
    await waitFor(() =>
      expect(within(dialog).getByRole('button', { name: /ver resumen/i })).toBeEnabled(),
    )
    await user.click(within(dialog).getByRole('button', { name: /ver resumen/i }))

    await waitFor(() => expect(within(dialog).getByText('Resumen de órdenes')).toBeInTheDocument())
    expect(within(dialog).getByText('Molinos del Norte')).toBeInTheDocument()

    await user.click(within(dialog).getByRole('button', { name: /confirmar y emitir/i }))

    await waitFor(() => expect(within(dialog).getByText('6 órdenes emitidas')).toBeInTheDocument())
    expect(within(dialog).getByText('Molinos del Norte')).toBeInTheDocument()
    expect(within(dialog).getByText('Carnes Premium SRL')).toBeInTheDocument()
    expect(within(dialog).getAllByText('Notificación enviada').length).toBeGreaterThan(0)
    expect(within(dialog).queryByText('Error de envío')).not.toBeInTheDocument()
  })

  it('runs the full platillos flow with recipe-aggregated items', async () => {
    const user = userEvent.setup()
    renderModal()
    const dialog = await screen.findByRole('dialog')

    await user.click(within(dialog).getByRole('button', { name: /por platillos/i }))
    await waitFor(() => expect(within(dialog).getByText('Pizza Margherita')).toBeInTheDocument())

    await user.type(
      within(dialog).getByRole('spinbutton', { name: /cantidad de pizza margherita/i }),
      '10',
    )
    await waitFor(() =>
      expect(within(dialog).getByRole('button', { name: /continuar/i })).toBeEnabled(),
    )
    await user.click(within(dialog).getByRole('button', { name: /continuar/i }))

    await waitFor(() => expect(within(dialog).getAllByRole('radiogroup')).toHaveLength(4))
    for (const group of within(dialog).getAllByRole('radiogroup')) {
      await user.click(within(group).getAllByRole('radio')[0])
    }
    await waitFor(() =>
      expect(within(dialog).getByRole('button', { name: /ver resumen/i })).toBeEnabled(),
    )
    await user.click(within(dialog).getByRole('button', { name: /ver resumen/i }))

    await waitFor(() => expect(within(dialog).getByText('Resumen de órdenes')).toBeInTheDocument())
    await user.click(within(dialog).getByRole('button', { name: /confirmar y emitir/i }))

    await waitFor(() => expect(within(dialog).getByText('4 órdenes emitidas')).toBeInTheDocument())
    expect(within(dialog).getByText('Molinos del Norte')).toBeInTheDocument()
  })
})
