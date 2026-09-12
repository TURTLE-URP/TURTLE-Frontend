import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ProveedoresFilters } from './proveedores-filters'

describe('ProveedoresFilters', () => {
  it('muestra el buscador del Figma con lupa', () => {
    const { container } = render(
      <ProveedoresFilters texto="" onTextoChange={vi.fn()} total={12} />,
    )
    expect(
      screen.getByPlaceholderText('Buscar por nombre, RUC, contacto...'),
    ).toBeInTheDocument()
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('notifica el texto tipeado', () => {
    const onTextoChange = vi.fn()
    render(<ProveedoresFilters texto="" onTextoChange={onTextoChange} total={12} />)
    fireEvent.change(screen.getByPlaceholderText('Buscar por nombre, RUC, contacto...'), {
      target: { value: 'andina' },
    })
    expect(onTextoChange).toHaveBeenCalledWith('andina')
  })

  it('muestra el conteo de proveedores con plural', () => {
    const { rerender } = render(
      <ProveedoresFilters texto="" onTextoChange={vi.fn()} total={12} />,
    )
    expect(screen.getByText('12 proveedores')).toBeInTheDocument()
    rerender(<ProveedoresFilters texto="" onTextoChange={vi.fn()} total={1} />)
    expect(screen.getByText('1 proveedor')).toBeInTheDocument()
  })
})