import { render, screen, within, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { StepAssign } from './step-assign'
import { INGREDIENTS } from '../logic/__fixtures__'
import type { OrderItem } from '../logic/types'

const items: OrderItem[] = [
  { ingredient: INGREDIENTS[0], qty: 2 },
  { ingredient: INGREDIENTS[1], qty: 1 },
]

describe('StepAssign', () => {
  it('renders one radiogroup per ingredient', () => {
    render(<StepAssign items={items} onUpdate={vi.fn()} onNext={vi.fn()} />)
    expect(screen.getAllByRole('radiogroup')).toHaveLength(2)
  })

  it('warns while not every ingredient is assigned', async () => {
    render(<StepAssign items={items} onUpdate={vi.fn()} onNext={vi.fn()} />)
    await waitFor(() =>
      expect(screen.getByRole('alert')).toHaveTextContent(/asigna un producto a cada insumo/i),
    )
  })

  it('keeps the next button disabled until every ingredient is assigned', async () => {
    render(<StepAssign items={items} onUpdate={vi.fn()} onNext={vi.fn()} />)
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /ver resumen/i })).toBeDisabled(),
    )
  })

  it('enables next and calls onUpdate once every ingredient has a product', async () => {
    const onUpdate = vi.fn()
    const user = userEvent.setup()
    render(<StepAssign items={items} onUpdate={onUpdate} onNext={vi.fn()} />)
    const groups = screen.getAllByRole('radiogroup')
    await user.click(within(groups[0]).getAllByRole('radio')[0])
    await user.click(within(groups[1]).getAllByRole('radio')[0])
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /ver resumen/i })).toBeEnabled(),
    )
    expect(onUpdate).toHaveBeenCalledTimes(2)
  })
})
