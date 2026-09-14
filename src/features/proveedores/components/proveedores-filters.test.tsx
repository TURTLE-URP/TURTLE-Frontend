import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ProveedoresFilters } from './proveedores-filters'

function renderFiltros(props: Partial<React.ComponentProps<typeof ProveedoresFilters>> = {}) {
  const handlers = { onTextoChange: vi.fn(), onNuevo: vi.fn() }
  render(<ProveedoresFilters texto="" {...handlers} {...props} />)
  return handlers
}

describe('ProveedoresFilters', () => {
  it('muestra el buscador del Figma con lupa', () => {
    const { container } = render(
      <ProveedoresFilters texto="" onTextoChange={vi.fn()} onNuevo={vi.fn()} />,
    )
    expect(
      screen.getByPlaceholderText('Buscar por nombre, RUC, contacto...'),
    ).toBeInTheDocument()
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('notifica el texto tipeado', () => {
    const { onTextoChange } = renderFiltros()
    fireEvent.change(screen.getByPlaceholderText('Buscar por nombre, RUC, contacto...'), {
      target: { value: 'andina' },
    })
    expect(onTextoChange).toHaveBeenCalledWith('andina')
  })

  it('abre el registro con el botón Nuevo Proveedor', () => {
    const { onNuevo } = renderFiltros()
    fireEvent.click(screen.getByRole('button', { name: 'Nuevo Proveedor' }))
    expect(onNuevo).toHaveBeenCalled()
  })
})