import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import {
  ListadoCargando,
  ListadoError,
  ListadoVacio,
  SinResultados,
} from './proveedores-states'

describe('ListadoCargando', () => {
  it('expone un estado de carga accesible con aria-busy', () => {
    render(<ListadoCargando />)
    const region = screen.getByRole('status')
    expect(region).toHaveTextContent('Cargando proveedores')
    expect(region).toHaveAttribute('aria-busy', 'true')
  })
})

describe('ListadoError', () => {
  it('muestra el mensaje y permite reintentar', () => {
    const onReintentar = vi.fn()
    render(<ListadoError onReintentar={onReintentar} />)
    expect(screen.getByRole('alert')).toHaveTextContent('No se pudo cargar el listado')
    fireEvent.click(screen.getByRole('button', { name: 'Reintentar' }))
    expect(onReintentar).toHaveBeenCalled()
  })
})

describe('ListadoVacio', () => {
  it('invita a registrar el primer proveedor', () => {
    const onRegistrar = vi.fn()
    render(<ListadoVacio onRegistrar={onRegistrar} />)
    expect(screen.getByText('Aún no hay proveedores registrados.')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Registrar primer proveedor' }))
    expect(onRegistrar).toHaveBeenCalled()
  })
})

describe('SinResultados', () => {
  it('sugiere limpiar la búsqueda', () => {
    const onLimpiar = vi.fn()
    render(<SinResultados onLimpiar={onLimpiar} />)
    expect(screen.getByText('No hay resultados que coincidan con tu búsqueda.')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Limpiar búsqueda' }))
    expect(onLimpiar).toHaveBeenCalled()
  })
})