import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { EstadoBadge } from './estado-badge'

describe('EstadoBadge', () => {
  it('muestra Activo como pill verde redondeado con punto', () => {
    const { container } = render(<EstadoBadge estado="Activo" />)
    const pill = screen.getByText('Activo')
    expect(pill).toBeInTheDocument()
    expect(pill).toHaveClass('rounded-full', 'bg-green-100', 'text-green-800')
    expect(container.querySelector('[aria-hidden="true"]')).toHaveClass('bg-green-600')
  })

  it('muestra Inactivo como pill rojo redondeado con punto', () => {
    const { container } = render(<EstadoBadge estado="Inactivo" />)
    const pill = screen.getByText('Inactivo')
    expect(pill).toBeInTheDocument()
    expect(pill).toHaveClass('rounded-full', 'bg-red-100', 'text-red-800')
    expect(container.querySelector('[aria-hidden="true"]')).toHaveClass('bg-red-600')
  })
})