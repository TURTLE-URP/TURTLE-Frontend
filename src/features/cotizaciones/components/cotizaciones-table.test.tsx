import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CotizacionesTable } from './cotizaciones-table'
import type { Cotizacion } from '../data/types'

const COTIZACION: Cotizacion = {
  id: 'c01',
  folio: 'COT-2026-001',
  proveedorNombre: 'Agro Andina',
  fecha: '2026-09-02',
  solicitudId: 's-c01',
  solicitudEstado: 'en negociación',
  total: 1250.5,
  moneda: 'PEN',
  ordenCompraId: null,
}

describe('CotizacionesTable', () => {
  it('muestra las columnas folio, proveedor, fecha, estado, total y acciones', () => {
    render(<CotizacionesTable cotizaciones={[COTIZACION]} />)
    for (const columna of ['Folio', 'Proveedor', 'Fecha', 'Estado', 'Total', 'Acciones']) {
      expect(screen.getByRole('columnheader', { name: columna })).toBeInTheDocument()
    }
  })

  it('muestra los datos de la fila con formato', () => {
    render(<CotizacionesTable cotizaciones={[COTIZACION]} />)
    expect(screen.getByRole('cell', { name: 'COT-2026-001' })).toBeInTheDocument()
    expect(screen.getByRole('cell', { name: 'Agro Andina' })).toBeInTheDocument()
    expect(screen.getByRole('cell', { name: '02/09/2026' })).toBeInTheDocument()
    expect(screen.getByRole('cell', { name: 'PEN 1,250.50' })).toBeInTheDocument()
  })

  it('renderiza las acciones provistas por fila', () => {
    render(
      <CotizacionesTable
        cotizaciones={[COTIZACION]}
        renderAcciones={(c) => <button type="button">{`Acción ${c.folio}`}</button>}
      />,
    )
    expect(screen.getByRole('button', { name: 'Acción COT-2026-001' })).toBeInTheDocument()
  })
})
