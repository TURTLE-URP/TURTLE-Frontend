import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { StepSummary } from './step-summary'
import { INGREDIENTS, SUPPLIER_PRODUCTS } from '../logic/__fixtures__'
import type { OrderItem } from '../logic/types'

function makeItem(ingredientId: string, productId: string, qty: number): OrderItem {
  const ingredient = INGREDIENTS.find((ing) => ing.id === ingredientId)
  const product = SUPPLIER_PRODUCTS.find((prod) => prod.id === productId)
  if (!ingredient || !product) {
    throw new Error(`Fixture missing: ${ingredientId}/${productId}`)
  }
  return { ingredient, qty, selectedProduct: product }
}

describe('StepSummary', () => {
  it('groups items by supplier', () => {
    render(
      <StepSummary
        items={[makeItem('i1', 'p1', 2), makeItem('i3', 'p5', 3), makeItem('i6', 'p10', 4)]}
        onConfirm={vi.fn()}
      />,
    )
    expect(screen.getByText('Molinos del Norte')).toBeInTheDocument()
    expect(screen.getByText('Agro Fresh SAC')).toBeInTheDocument()
    expect(screen.getByText('Distribuidora Granos SA')).toBeInTheDocument()
  })

  it('shows per-supplier subtotals and the grand total in es-PE', () => {
    render(
      <StepSummary
        items={[
          makeItem('i3', 'p5', 2),
          makeItem('i8', 'p12', 1),
          makeItem('i6', 'p10', 3),
          makeItem('i1', 'p2', 2),
        ]}
        onConfirm={vi.fn()}
      />,
    )
    expect(screen.getByText('S/ 71.00')).toBeInTheDocument()
    expect(screen.getByText('S/ 41.20')).toBeInTheDocument()
    expect(screen.getByText('S/ 112.20')).toBeInTheDocument()
  })

  it('calls onConfirm when the confirm button is clicked', async () => {
    const onConfirm = vi.fn()
    const user = userEvent.setup()
    render(<StepSummary items={[makeItem('i1', 'p1', 2)]} onConfirm={onConfirm} />)
    await user.click(screen.getByRole('button', { name: /confirmar y emitir/i }))
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })
})
