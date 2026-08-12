import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { StatusBadge } from './status-badge'
import type { OrderStatus } from '../logic/types'

const STATUS_TOKENS: Record<OrderStatus, string> = {
  Emitida: 'bg-primary/10 text-primary border-primary/20',
  Pendiente: 'bg-chart-4/10 text-chart-4 border-chart-4/20',
  Acordada: 'bg-accent/10 text-accent border-accent/20',
  Entregada: 'bg-secondary/15 text-secondary border-secondary/20',
  Error: 'bg-destructive/10 text-destructive border-destructive/20',
}

const DOT_TOKENS: Record<OrderStatus, string> = {
  Emitida: 'bg-primary',
  Pendiente: 'bg-chart-4',
  Acordada: 'bg-accent',
  Entregada: 'bg-secondary',
  Error: 'bg-destructive',
}

describe('StatusBadge', () => {
  const statuses: OrderStatus[] = ['Emitida', 'Pendiente', 'Acordada', 'Entregada', 'Error']

  for (const status of statuses) {
    it(`renders ${status} with text and the mapped badge token`, () => {
      render(<StatusBadge status={status} />)
      const badge = screen.getByText(status)
      expect(badge).toBeInTheDocument()
      expect(badge).toHaveClass(STATUS_TOKENS[status])
    })

    it(`renders the ${status} dot with the mapped token`, () => {
      render(<StatusBadge status={status} />)
      const badge = screen.getByText(status)
      const dot = badge.querySelector('span')
      expect(dot).not.toBeNull()
      expect(dot).toHaveClass(DOT_TOKENS[status])
    })
  }

  it('never conveys status by color alone (text is always present)', () => {
    render(<StatusBadge status="Pendiente" />)
    expect(screen.getByText('Pendiente')).toHaveTextContent('Pendiente')
  })
})
