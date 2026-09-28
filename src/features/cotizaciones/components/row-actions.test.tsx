import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { RowActions } from './row-actions'
import type { Cotizacion } from '../data/types'

function cotizacion(estado: Cotizacion['solicitudEstado']): Cotizacion {
  return {
    id: 'c01',
    folio: 'COT-2026-001',
    proveedorNombre: 'Agro Andina',
    fecha: '2026-09-02',
    solicitudId: 's-c01',
    solicitudEstado: estado,
    total: 1250.5,
    moneda: 'PEN',
    ordenCompraId: estado === 'aprobada' ? 'oc-101' : null,
  }
}

describe('RowActions', () => {
  it('en negociación: cerrar habilitado, ver Orden deshabilitado con motivo', () => {
    render(<RowActions cotizacion={cotizacion('en negociación')} onCerrar={vi.fn()} />)
    expect(screen.getByRole('button', { name: /cerrar cotización/i })).toBeEnabled()
    const verOrden = screen.getByRole('button', { name: /ver orden de compra/i })
    expect(verOrden).toBeDisabled()
    expect(screen.getByText(/solicitud está aprobada/i)).toBeInTheDocument()
  })

  it('en aprobada: ver Orden habilitado como enlace en pestaña nueva', () => {
    render(<RowActions cotizacion={cotizacion('aprobada')} onCerrar={vi.fn()} />)
    const enlace = screen.getByRole('link', { name: /ver orden de compra/i })
    expect(enlace).toHaveAttribute('target', '_blank')
    expect(enlace).toHaveAttribute('href', expect.stringContaining('oc-101'))
  })

  it('ver detalles siempre es un enlace en pestaña nueva', () => {
    render(<RowActions cotizacion={cotizacion('rechazada')} onCerrar={vi.fn()} />)
    const enlace = screen.getByRole('link', { name: /ver detalles/i })
    expect(enlace).toHaveAttribute('target', '_blank')
    expect(enlace).toHaveAttribute('href', expect.stringContaining('c01'))
  })

  it('cerrar invoca onCerrar con la cotización', () => {
    const onCerrar = vi.fn()
    const c = cotizacion('en negociación')
    render(<RowActions cotizacion={c} onCerrar={onCerrar} />)
    fireEvent.click(screen.getByRole('button', { name: /cerrar cotización/i }))
    expect(onCerrar).toHaveBeenCalledWith(c)
  })
})
