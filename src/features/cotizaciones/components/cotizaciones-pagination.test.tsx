import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { CotizacionesPagination } from './cotizaciones-pagination'

describe('CotizacionesPagination', () => {
  it('marca la página actual', () => {
    render(<CotizacionesPagination pagina={2} totalPaginas={3} onPaginaChange={vi.fn()} />)
    expect(screen.getByRole('button', { name: '2' })).toHaveAttribute('aria-current', 'page')
  })

  it('navega a la página elegida', () => {
    const onPaginaChange = vi.fn()
    render(<CotizacionesPagination pagina={2} totalPaginas={3} onPaginaChange={onPaginaChange} />)
    fireEvent.click(screen.getByRole('button', { name: '3' }))
    expect(onPaginaChange).toHaveBeenCalledWith(3)
    fireEvent.click(screen.getByRole('button', { name: 'Siguiente' }))
    expect(onPaginaChange).toHaveBeenCalledWith(3)
    fireEvent.click(screen.getByRole('button', { name: 'Primera página' }))
    expect(onPaginaChange).toHaveBeenCalledWith(1)
  })

  it('deshabilita anterior/siguiente en los bordes', () => {
    const { rerender } = render(
      <CotizacionesPagination pagina={1} totalPaginas={3} onPaginaChange={vi.fn()} />,
    )
    expect(screen.getByRole('button', { name: 'Primera página' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Anterior' })).toBeDisabled()
    rerender(<CotizacionesPagination pagina={3} totalPaginas={3} onPaginaChange={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Siguiente' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Última página' })).toBeDisabled()
  })
})
