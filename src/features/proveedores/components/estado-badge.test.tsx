import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CondicionBadge } from './estado-badge'

describe('CondicionBadge', () => {
  it('muestra Habido como pill verde redondeado con punto', () => {
    const { container } = render(<CondicionBadge condicion="Habido" />)
    const pill = screen.getByText('Habido')
    expect(pill).toBeInTheDocument()
    expect(pill).toHaveClass('rounded-full', 'bg-green-100', 'text-green-800')
    expect(container.querySelector('[aria-hidden="true"]')).toHaveClass('bg-green-600')
  })

  it('muestra No hallado como pill rojo redondeado con punto', () => {
    const { container } = render(<CondicionBadge condicion="No hallado" />)
    const pill = screen.getByText('No hallado')
    expect(pill).toBeInTheDocument()
    expect(pill).toHaveClass('rounded-full', 'bg-red-100', 'text-red-800')
    expect(container.querySelector('[aria-hidden="true"]')).toHaveClass('bg-red-600')
  })

  it('muestra No habido como pill ámbar redondeado con punto', () => {
    const { container } = render(<CondicionBadge condicion="No habido" />)
    const pill = screen.getByText('No habido')
    expect(pill).toBeInTheDocument()
    expect(pill).toHaveClass('rounded-full', 'bg-amber-100', 'text-amber-800')
    expect(container.querySelector('[aria-hidden="true"]')).toHaveClass('bg-amber-600')
  })

  it('muestra En proceso de verificación como pill azul redondeado con punto', () => {
    const { container } = render(<CondicionBadge condicion="En proceso de verificación" />)
    const pill = screen.getByText('En proceso de verificación')
    expect(pill).toBeInTheDocument()
    expect(pill).toHaveClass('rounded-full', 'bg-blue-100', 'text-blue-800')
    expect(container.querySelector('[aria-hidden="true"]')).toHaveClass('bg-blue-600')
  })
})