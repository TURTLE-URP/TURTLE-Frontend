import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { Proveedor } from '../data/types'
import { ProveedorConfirmDialog } from './proveedor-confirm-dialog'

const PROVEEDOR_MOCK: Proveedor = {
  id: 'p01',
  nombreComercial: 'Agro Andina',
  ruc: '20123456789',
  razonSocial: 'Agro Andina S.A.C.',
  contactos: [
    { nombre: 'María López', telefono: '+51 1 555 0101', email: 'maria@agroandina.pe' },
  ],
  direccion: 'Av. Industrial 120',
  fechaRegistro: '2026-01-15T10:00:00Z',
  condicion: 'Habido',
}

function renderDialog(
  props: Partial<React.ComponentProps<typeof ProveedorConfirmDialog>> = {},
) {
  return render(
    <ProveedorConfirmDialog
      abierto
      proveedor={PROVEEDOR_MOCK}
      onCerrar={vi.fn()}
      onConfirmar={vi.fn()}
      {...props}
    />,
  )
}

describe('ProveedorConfirmDialog', () => {
  it('muestra el título "Eliminar proveedor"', () => {
    renderDialog()
    expect(screen.getByRole('alertdialog')).toBeInTheDocument()
    expect(screen.getByText('Eliminar proveedor')).toBeInTheDocument()
  })

  it('muestra la descripción con el nombre del proveedor en negrita', () => {
    renderDialog()
    expect(screen.getByText(/¿Deseas eliminar a/)).toBeInTheDocument()
    expect(screen.getByText('Agro Andina')).toBeInTheDocument()
  })

  it('muestra botones Cancelar y Sí, eliminar', () => {
    renderDialog()
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sí, eliminar' })).toBeInTheDocument()
  })

  it('llama a onConfirmar al hacer clic en Sí, eliminar', async () => {
    const onConfirmar = vi.fn()
    renderDialog({ onConfirmar })
    fireEvent.click(screen.getByRole('button', { name: 'Sí, eliminar' }))
    await waitFor(() => expect(onConfirmar).toHaveBeenCalled())
  })

  it('llama a onCerrar al hacer clic en Cancelar', async () => {
    const onCerrar = vi.fn()
    renderDialog({ onCerrar })
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }))
    await waitFor(() => expect(onCerrar).toHaveBeenCalled())
  })

  it('no renderiza nada cuando abierto es false', () => {
    renderDialog({ abierto: false })
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
  })
})
