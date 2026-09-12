import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { Proveedor } from '../data/types'
import { ProveedoresTable } from './proveedores-table'

const ACTIVO: Proveedor = {
  id: 'p1',
  nombreComercial: 'Agro Andina',
  ruc: '20123456789',
  razonSocial: 'Agro Andina S.A.C.',
  contactoNombre: 'María López',
  contactoTelefono: '+51 1 555 0101',
  contactoEmail: 'maria@agroandina.pe',
  direccion: 'Av. Industrial 120',
  ciudad: 'Arequipa',
  fechaRegistro: '2026-01-15T10:00:00Z',
  estado: 'Activo',
}

const INACTIVO: Proveedor = {
  id: 'p2',
  nombreComercial: 'Textiles Lima',
  ruc: '20500112233',
  razonSocial: 'Textiles Lima S.A.C.',
  contactoNombre: 'Carlos Guerra',
  contactoTelefono: '+51 1 555 0102',
  contactoEmail: 'carlos@textileslima.pe',
  direccion: 'Jr. Unión 45',
  ciudad: 'Lima',
  fechaRegistro: '2026-02-20T10:00:00Z',
  estado: 'Inactivo',
}

function renderTabla(proveedores: Proveedor[], base = 0) {
  const handlers = {
    onEditar: vi.fn(),
    onDesactivar: vi.fn(),
    onReactivar: vi.fn(),
  }
  render(<ProveedoresTable proveedores={proveedores} base={base} {...handlers} />)
  return handlers
}

describe('ProveedoresTable', () => {
  it('muestra las columnas del Figma', () => {
    renderTabla([ACTIVO])
    for (const columna of ['#', 'Proveedor', 'RUC', 'Contacto', 'Ciudad', 'Registrado', 'Estado', 'Acciones']) {
      expect(screen.getByRole('columnheader', { name: columna })).toBeInTheDocument()
    }
  })

  it('numera las filas con el índice global', () => {
    renderTabla([ACTIVO, INACTIVO], 10)
    expect(screen.getByText('011')).toBeInTheDocument()
    expect(screen.getByText('012')).toBeInTheDocument()
  })

  it('muestra nombre comercial con razón social y contacto con email', () => {
    renderTabla([ACTIVO, INACTIVO])
    expect(screen.getByText('Agro Andina')).toBeInTheDocument()
    expect(screen.getByText('Agro Andina S.A.C.')).toBeInTheDocument()
    expect(screen.getByText('María López')).toBeInTheDocument()
    expect(screen.getByText('maria@agroandina.pe')).toBeInTheDocument()
    expect(screen.getByText('Arequipa')).toBeInTheDocument()
    expect(screen.getByText('20123456789')).toBeInTheDocument()
    expect(screen.getByText('15/01/2026')).toBeInTheDocument()
    expect(screen.getAllByRole('row')).toHaveLength(3) // cabecera + 2 filas
  })

  it('muestra el badge de estado y las acciones con iconos accesibles', () => {
    renderTabla([ACTIVO, INACTIVO])
    expect(screen.getByText('Activo')).toBeInTheDocument()
    expect(screen.getByText('Inactivo')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: 'Editar' })).toHaveLength(2)
    expect(screen.getByRole('button', { name: 'Desactivar' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reactivar' })).toBeInTheDocument()
  })

  it('llama a onEditar con el proveedor correcto', () => {
    const { onEditar } = renderTabla([ACTIVO])
    fireEvent.click(screen.getByRole('button', { name: 'Editar' }))
    expect(onEditar).toHaveBeenCalledWith(ACTIVO)
  })

  it('llama a onDesactivar para proveedores activos', () => {
    const { onDesactivar } = renderTabla([ACTIVO])
    fireEvent.click(screen.getByRole('button', { name: 'Desactivar' }))
    expect(onDesactivar).toHaveBeenCalledWith(ACTIVO)
  })

  it('llama a onReactivar para proveedores inactivos', () => {
    const { onReactivar } = renderTabla([INACTIVO])
    fireEvent.click(screen.getByRole('button', { name: 'Reactivar' }))
    expect(onReactivar).toHaveBeenCalledWith(INACTIVO)
  })
})