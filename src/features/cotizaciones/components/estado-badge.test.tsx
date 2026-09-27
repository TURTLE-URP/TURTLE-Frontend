import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { EstadoBadge } from './estado-badge'

describe('EstadoBadge', () => {
  it.each([
    ['aprobada'],
    ['en negociación'],
    ['rechazada'],
    ['pendiente'],
  ] as const)('muestra el estado %s', (estado) => {
    render(<EstadoBadge estado={estado} />)
    expect(screen.getByText(estado)).toBeInTheDocument()
  })
})
