import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ListadoCargando, ListadoError, ListadoVacio, SinResultados } from './cotizaciones-states'

describe('cotizaciones-states', () => {
  it('muestra carga con región ocupada', () => {
    render(<ListadoCargando />)
    expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true')
  })

  it('muestra error con reintento', () => {
    const onReintentar = vi.fn()
    render(<ListadoError onReintentar={onReintentar} />)
    expect(screen.getByRole('alert')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Reintentar' }))
    expect(onReintentar).toHaveBeenCalled()
  })

  it('muestra maestro vacío sin punto de creación', () => {
    render(<ListadoVacio />)
    expect(screen.getByText('Aún no hay cotizaciones registradas.')).toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('menciona el criterio usado y permite limpiar', () => {
    const onLimpiar = vi.fn()
    render(<SinResultados criterios="folio «COT-1»" onLimpiar={onLimpiar} />)
    expect(screen.getByText(/folio «COT-1»/)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Limpiar filtros' }))
    expect(onLimpiar).toHaveBeenCalled()
  })
})
