import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ProveedoresPagination } from './proveedores-pagination'

describe('ProveedoresPagination', () => {
  it('marca la página actual', () => {
    render(
      <ProveedoresPagination pagina={2} totalPaginas={3} onPaginaChange={vi.fn()} />,
    )
    expect(screen.getByRole('button', { name: '2' })).toHaveAttribute('aria-current', 'page')
  })

  it('resalta la página actual en azul Figma', () => {
    render(
      <ProveedoresPagination pagina={2} totalPaginas={3} onPaginaChange={vi.fn()} />,
    )
    const actual = screen.getByRole('button', { name: '2' })
    expect(actual).toHaveClass('bg-blue-700', 'text-white')
    expect(screen.getByRole('button', { name: '3' })).not.toHaveClass('bg-blue-700')
  })

  it('navega a la página elegida', () => {
    const onPaginaChange = vi.fn()
    render(
      <ProveedoresPagination pagina={2} totalPaginas={3} onPaginaChange={onPaginaChange} />,
    )
    fireEvent.click(screen.getByRole('button', { name: '3' }))
    expect(onPaginaChange).toHaveBeenCalledWith(3)
    fireEvent.click(screen.getByRole('button', { name: 'Siguiente' }))
    expect(onPaginaChange).toHaveBeenCalledWith(3)
    fireEvent.click(screen.getByRole('button', { name: 'Última página' }))
    expect(onPaginaChange).toHaveBeenCalledWith(3)
    fireEvent.click(screen.getByRole('button', { name: 'Primera página' }))
    expect(onPaginaChange).toHaveBeenCalledWith(1)
    fireEvent.click(screen.getByRole('button', { name: 'Anterior' }))
    expect(onPaginaChange).toHaveBeenCalledWith(1)
  })

  it('deshabilita los controles en los extremos', () => {
    const { rerender } = render(
      <ProveedoresPagination pagina={1} totalPaginas={3} onPaginaChange={vi.fn()} />,
    )
    expect(screen.getByRole('button', { name: 'Primera página' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Anterior' })).toBeDisabled()
    rerender(
      <ProveedoresPagination pagina={3} totalPaginas={3} onPaginaChange={vi.fn()} />,
    )
    expect(screen.getByRole('button', { name: 'Siguiente' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Última página' })).toBeDisabled()
  })
})