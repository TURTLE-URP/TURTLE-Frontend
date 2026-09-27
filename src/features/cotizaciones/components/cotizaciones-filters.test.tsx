import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { CotizacionesFilters } from './cotizaciones-filters'

const PROPS = {
  texto: '',
  onTextoChange: vi.fn(),
  estado: 'todas' as const,
  onEstadoChange: vi.fn(),
  desde: null as string | null,
  hasta: null as string | null,
  onDesdeChange: vi.fn(),
  onHastaChange: vi.fn(),
  onLimpiar: vi.fn(),
}

describe('CotizacionesFilters', () => {
  it('expone búsqueda, filtro de estado y rango de fechas con etiquetas', () => {
    render(<CotizacionesFilters {...PROPS} />)
    expect(screen.getByLabelText('Buscar')).toBeInTheDocument()
    expect(screen.getByLabelText('Estado')).toBeInTheDocument()
    expect(screen.getByLabelText('Desde')).toBeInTheDocument()
    expect(screen.getByLabelText('Hasta')).toBeInTheDocument()
  })

  it('propaga los cambios de cada control', () => {
    render(<CotizacionesFilters {...PROPS} />)
    fireEvent.change(screen.getByLabelText('Buscar'), { target: { value: 'andina' } })
    expect(PROPS.onTextoChange).toHaveBeenCalledWith('andina')
    fireEvent.change(screen.getByLabelText('Desde'), { target: { value: '2026-09-01' } })
    expect(PROPS.onDesdeChange).toHaveBeenCalledWith('2026-09-01')
    fireEvent.change(screen.getByLabelText('Hasta'), { target: { value: '2026-09-30' } })
    expect(PROPS.onHastaChange).toHaveBeenCalledWith('2026-09-30')
  })

  it('limpia todos los criterios', () => {
    render(<CotizacionesFilters {...PROPS} texto="andina" />)
    fireEvent.click(screen.getByRole('button', { name: 'Limpiar filtros' }))
    expect(PROPS.onLimpiar).toHaveBeenCalled()
  })
})
