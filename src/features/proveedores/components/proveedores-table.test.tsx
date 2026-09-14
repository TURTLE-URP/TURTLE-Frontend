import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { Proveedor } from '../data/types'
import { ProveedoresTable } from './proveedores-table'

const HABIDO: Proveedor = {
  id: 'p1',
  nombreComercial: 'Agro Andina',
  ruc: '20123456789',
  razonSocial: 'Agro Andina S.A.C.',
  contactos: [{ nombre: 'María López', telefono: '+51 1 555 0101', email: 'maria@agroandina.pe' }],
  direccion: 'Av. Industrial 120',
  fechaRegistro: '2026-01-15T10:00:00Z',
  condicion: 'Habido',
}

const NO_HALLADO: Proveedor = {
  id: 'p2',
  nombreComercial: 'Textiles Lima',
  ruc: '20500112233',
  razonSocial: 'Textiles Lima S.A.C.',
  contactos: [{ nombre: 'Carlos Guerra', telefono: '+51 1 555 0102', email: 'carlos@textileslima.pe' }],
  direccion: 'Jr. Unión 45',
  fechaRegistro: '2026-02-20T10:00:00Z',
  condicion: 'No hallado',
}

function renderTabla(proveedores: Proveedor[], base = 0) {
  const handlers = {
    onEditar: vi.fn(),
    onEliminar: vi.fn(),
  }
  render(<ProveedoresTable proveedores={proveedores} base={base} {...handlers} />)
  return handlers
}

describe('ProveedoresTable', () => {
  it('muestra las columnas del Figma', () => {
    renderTabla([HABIDO])
    for (const columna of ['#', 'Proveedor', 'RUC', 'Condición', 'Acciones']) {
      expect(screen.getByRole('columnheader', { name: columna })).toBeInTheDocument()
    }
  })

  it('numera las filas con el índice global', () => {
    renderTabla([HABIDO, NO_HALLADO], 10)
    expect(screen.getByText('011')).toBeInTheDocument()
    expect(screen.getByText('012')).toBeInTheDocument()
  })

  it('muestra nombre comercial con razón social', () => {
    renderTabla([HABIDO, NO_HALLADO])
    expect(screen.getByText('Agro Andina')).toBeInTheDocument()
    expect(screen.getByText('Agro Andina S.A.C.')).toBeInTheDocument()
    expect(screen.getByText('20123456789')).toBeInTheDocument()
    expect(screen.getAllByRole('row')).toHaveLength(3)
  })

  it('muestra el badge de condición y las acciones con iconos accesibles', () => {
    renderTabla([HABIDO, NO_HALLADO])
    expect(screen.getByText('Habido')).toBeInTheDocument()
    expect(screen.getByText('No hallado')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: 'Ver/Editar' })).toHaveLength(2)
    expect(screen.getAllByRole('button', { name: 'Eliminar' })).toHaveLength(2)
  })

  it('llama a onEditar con el proveedor correcto', () => {
    const { onEditar } = renderTabla([HABIDO])
    fireEvent.click(screen.getByRole('button', { name: 'Ver/Editar' }))
    expect(onEditar).toHaveBeenCalledWith(HABIDO)
  })

  it('llama a onEliminar con el proveedor correcto', () => {
    const { onEliminar } = renderTabla([HABIDO])
    fireEvent.click(screen.getByRole('button', { name: 'Eliminar' }))
    expect(onEliminar).toHaveBeenCalledWith(HABIDO)
  })
})