import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { StepConfigure } from './step-configure'
import type { Mock } from 'vitest'
import type { Modality, OrderItem } from '../logic/types'

const mockShortage = vi.hoisted(() => ({ data: [] as OrderItem[] }))

vi.mock('../logic/api/hooks', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../logic/api/hooks')>()
  return {
    ...actual,
    useShortageItems: () => ({ data: mockShortage.data, isPending: false, isError: false }),
  }
})

const harina: OrderItem = {
  ingredient: {
    id: 'i1',
    name: 'Harina de trigo',
    unit: 'kg',
    currentStock: 8,
    desiredStock: 25,
    category: 'Secos',
  },
  qty: 17,
}

const tomate: OrderItem = {
  ingredient: {
    id: 'i3',
    name: 'Tomate',
    unit: 'kg',
    currentStock: 5,
    desiredStock: 20,
    category: 'Frescos',
  },
  qty: 15,
}

function renderConfigure(
  modality: Modality = 'libre',
  onNext: Mock<(items: OrderItem[]) => void> = vi.fn(),
) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  render(
    <QueryClientProvider client={client}>
      <StepConfigure modality={modality} onNext={onNext} />
    </QueryClientProvider>,
  )
  return onNext
}

describe('StepConfigure (libre)', () => {
  it('keeps Continuar disabled until at least one quantity is entered', async () => {
    renderConfigure()
    const next = screen.getByRole('button', { name: /continuar/i })
    await waitFor(() => expect(next).toBeDisabled())
  })

  it('enables Continuar once a quantity is greater than 0', async () => {
    const user = userEvent.setup()
    renderConfigure()
    await user.type(screen.getByRole('spinbutton', { name: /cantidad de harina/i }), '5')
    const next = screen.getByRole('button', { name: /continuar/i })
    await waitFor(() => expect(next).toBeEnabled())
  })

  it('calls onNext with the calculated items', async () => {
    const user = userEvent.setup()
    const onNext = renderConfigure()
    await user.type(screen.getByRole('spinbutton', { name: /cantidad de harina/i }), '5')
    await user.click(screen.getByRole('button', { name: /continuar/i }))
    await waitFor(() => expect(onNext).toHaveBeenCalledTimes(1))
    const items = onNext.mock.calls[0][0] as OrderItem[]
    expect(items[0]).toMatchObject({ qty: 5 })
  })
})

describe('StepConfigure (escasez)', () => {
  beforeEach(() => {
    mockShortage.data = []
  })

  it('renders the computed shortage rows without editable inputs', async () => {
    mockShortage.data = [harina, tomate]
    renderConfigure('escasez')

    expect(await screen.findByText('Harina de trigo')).toBeInTheDocument()
    expect(screen.getByText('8 kg')).toBeInTheDocument()
    expect(screen.getByText('25 kg')).toBeInTheDocument()
    expect(screen.getByText('17 kg')).toBeInTheDocument()
    expect(screen.getByText('Tomate')).toBeInTheDocument()
    expect(screen.getByText('15 kg')).toBeInTheDocument()
    expect(screen.queryByRole('spinbutton')).not.toBeInTheDocument()
  })

  it('enables Continuar and calls onNext with the calculated shortage items', async () => {
    const user = userEvent.setup()
    mockShortage.data = [harina, tomate]
    const onNext = renderConfigure('escasez')

    const next = await screen.findByRole('button', { name: /continuar/i })
    await waitFor(() => expect(next).toBeEnabled())

    await user.click(next)
    await waitFor(() => expect(onNext).toHaveBeenCalledTimes(1))
    const items = onNext.mock.calls[0][0] as OrderItem[]
    expect(items).toHaveLength(8)
    expect(items[0]).toMatchObject({ ingredient: { id: 'i1' }, qty: 17 })
  })

  it('blocks Continuar when there are no shortage ingredients', async () => {
    renderConfigure('escasez')

    expect(await screen.findByText('No hay insumos en escasez')).toBeInTheDocument()
    const next = screen.getByRole('button', { name: /continuar/i })
    await waitFor(() => expect(next).toBeDisabled())
  })
})

describe('StepConfigure (platillos)', () => {
  it('renders the dish rows and keeps Continuar disabled with no quantities', async () => {
    renderConfigure('platillos')

    for (const name of ['Pizza Margherita', 'Pasta Alfredo', 'Pollo al ajillo', 'Pasta Napolitana']) {
      expect(screen.getByText(name)).toBeInTheDocument()
    }
    const next = screen.getByRole('button', { name: /continuar/i })
    await waitFor(() => expect(next).toBeDisabled())
  })

  it('enables Continuar once a dish quantity is greater than 0', async () => {
    const user = userEvent.setup()
    renderConfigure('platillos')
    await user.type(screen.getByRole('spinbutton', { name: /cantidad de pizza margherita/i }), '2')
    const next = screen.getByRole('button', { name: /continuar/i })
    await waitFor(() => expect(next).toBeEnabled())
  })

  it('calls onNext with items aggregated from the recipes', async () => {
    const user = userEvent.setup()
    const onNext = renderConfigure('platillos')
    await user.type(screen.getByRole('spinbutton', { name: /cantidad de pizza margherita/i }), '10')
    await user.click(screen.getByRole('button', { name: /continuar/i }))
    await waitFor(() => expect(onNext).toHaveBeenCalledTimes(1))
    const items = onNext.mock.calls[0][0] as OrderItem[]
    expect(items).toHaveLength(4)
    const byIngredient = Object.fromEntries(items.map((i) => [i.ingredient.id, i.qty]))
    expect(byIngredient).toEqual({ i1: 3, i3: 1.5, i4: 1.2, i2: 0.2 })
  })
})
