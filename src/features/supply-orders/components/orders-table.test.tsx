import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { OrdersTable } from './orders-table'
import type { HistoryEntry } from '../logic/types'

const GROUP: HistoryEntry = {
  groupId: 'G-001',
  date: '2026-07-20',
  modality: 'Por escasez',
  orders: [
    { id: 'OA-0011', supplier: 'Agro Fresh SAC', date: '2026-07-20', status: 'Acordada', total: 186.5, products: 3 },
    { id: 'OA-0012', supplier: 'Lácteos del Campo', date: '2026-07-20', status: 'Entregada', total: 94.0, products: 2 },
  ],
}

const SINGLE: HistoryEntry = {
  id: 'OA-0010',
  supplier: 'Carnes Premium SRL',
  date: '2026-07-18',
  status: 'Entregada',
  total: 216.0,
  products: 1,
}

describe('OrdersTable', () => {
  it('renders single rows and group rows', () => {
    render(<OrdersTable entries={[SINGLE, GROUP]} expanded={new Set()} onToggleGroup={vi.fn()} />)
    expect(screen.getByText('OA-0010')).toBeInTheDocument()
    expect(screen.getByText('G-001')).toBeInTheDocument()
  })

  it('keeps child orders hidden while a group is collapsed', () => {
    render(<OrdersTable entries={[GROUP]} expanded={new Set()} onToggleGroup={vi.fn()} />)
    expect(screen.getByText('G-001')).toBeInTheDocument()
    expect(screen.queryByText('OA-0011')).not.toBeInTheDocument()
  })

  it('shows child orders when a group is expanded', () => {
    render(<OrdersTable entries={[GROUP]} expanded={new Set(['G-001'])} onToggleGroup={vi.fn()} />)
    expect(screen.getByText(/OA-0011/)).toBeInTheDocument()
    expect(screen.getByText('Lácteos del Campo')).toBeInTheDocument()
  })

  it('exposes the expand control as a keyboard-operable button wired to onToggleGroup', async () => {
    const onToggleGroup = vi.fn()
    const user = userEvent.setup()
    render(<OrdersTable entries={[GROUP]} expanded={new Set()} onToggleGroup={onToggleGroup} />)
    const toggle = screen.getByRole('button', { name: /G-001/ })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(toggle).toHaveAttribute('aria-controls')
    await user.click(toggle)
    expect(onToggleGroup).toHaveBeenCalledWith('G-001')
  })

  it('shows the empty message when there are no entries', () => {
    render(<OrdersTable entries={[]} expanded={new Set()} onToggleGroup={vi.fn()} />)
    expect(screen.getByText('Aún no hay órdenes registradas.')).toBeInTheDocument()
  })
})
