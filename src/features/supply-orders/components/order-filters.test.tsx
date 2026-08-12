import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { OrderFilters } from './order-filters'
import type { OrderStatus } from '../logic/types'

const STATUSES: readonly OrderStatus[] = ['Emitida', 'Pendiente', 'Acordada', 'Entregada', 'Error']

function Harness() {
  const [active, setActive] = useState('Todas')
  const [query, setQuery] = useState('')
  return (
    <OrderFilters
      statuses={STATUSES}
      active={active}
      onStatusChange={setActive}
      query={query}
      onQueryChange={setQuery}
    />
  )
}

describe('OrderFilters', () => {
  it('renders a pill per status plus the "Todas" filter', () => {
    render(
      <OrderFilters
        statuses={STATUSES}
        active="Todas"
        onStatusChange={vi.fn()}
        query=""
        onQueryChange={vi.fn()}
      />,
    )
    expect(screen.getByRole('button', { name: 'Todas' })).toBeInTheDocument()
    for (const status of STATUSES) {
      expect(screen.getByRole('button', { name: status })).toBeInTheDocument()
    }
  })

  it('marks the active filter with aria-pressed', () => {
    render(
      <OrderFilters
        statuses={STATUSES}
        active="Entregada"
        onStatusChange={vi.fn()}
        query=""
        onQueryChange={vi.fn()}
      />,
    )
    expect(screen.getByRole('button', { name: 'Entregada' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Todas' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('calls onStatusChange when a pill is clicked', async () => {
    const onStatusChange = vi.fn()
    const user = userEvent.setup()
    render(
      <OrderFilters
        statuses={STATUSES}
        active="Todas"
        onStatusChange={onStatusChange}
        query=""
        onQueryChange={vi.fn()}
      />,
    )
    await user.click(screen.getByRole('button', { name: 'Pendiente' }))
    expect(onStatusChange).toHaveBeenCalledWith('Pendiente')
  })

  it('renders a search input and wires onQueryChange', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    const search = screen.getByRole('searchbox', { name: /buscar/i })
    await user.type(search, 'agro')
    expect(search).toHaveValue('agro')
  })
})
