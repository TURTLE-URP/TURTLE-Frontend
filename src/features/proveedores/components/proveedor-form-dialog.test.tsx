import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest'
import { useToastStore } from '@/stores/toast-store'
import type { Proveedor } from '../data/types'
import { ProveedorFormDialog } from './proveedor-form-dialog'

function renderDialog({
  onCerrar = vi.fn(),
  onExito = vi.fn(),
}: {
  onCerrar?: () => void
  onExito?: Mock<(proveedor: Proveedor) => void>
} = {}) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  render(
    <QueryClientProvider client={queryClient}>
      <ProveedorFormDialog abierto onCerrar={onCerrar} onExito={onExito} />
    </QueryClientProvider>,
  )
  return { onCerrar, onExito }
}

function completarContacto() {
  fireEvent.change(screen.getByLabelText(/nombre de contacto/i), {
    target: { value: 'Juana Pérez' },
  })
  fireEvent.change(screen.getByLabelText(/teléfono/i), {
    target: { value: '+51 1 555 0199' },
  })
  fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
    target: { value: 'juana@nuevosol.pe' },
  })
}

beforeEach(() => {
  useToastStore.setState({ toasts: [] })
})

describe('ProveedorFormDialog (registro)', () => {
  it('muestra la consulta RUC primero y las secciones bloqueadas', () => {
    renderDialog()
    expect(screen.getByRole('dialog', { name: 'Nuevo proveedor' })).toBeInTheDocument()
    expect(screen.getByText('Consulta RUC')).toBeInTheDocument()
    expect(screen.getByText('Identificación')).toBeInTheDocument()
    expect(screen.getByText('Contacto')).toBeInTheDocument()
    expect(screen.getByText('Ubicación')).toBeInTheDocument()
    expect(screen.getByLabelText(/nombre comercial/i)).toBeDisabled()
    expect(screen.getByLabelText(/razón social/i)).toBeDisabled()
    expect(screen.getByLabelText(/nombre de contacto/i)).toBeDisabled()
    expect(screen.getByLabelText(/dirección/i)).toBeDisabled()
    expect(screen.queryByLabelText(/ciudad/i)).not.toBeInTheDocument()
  })

  it('bloquea Guardar hasta ingresar el RUC con texto guía', () => {
    const { onExito } = renderDialog()
    expect(screen.getByRole('button', { name: 'Registrar Proveedor' })).toBeDisabled()
    expect(screen.getByText('Ingresa un RUC para continuar.')).toBeInTheDocument()
    expect(onExito).not.toHaveBeenCalled()
  })

  it('avisa formato inválido en vivo ante letras o símbolos', async () => {
    const { onExito } = renderDialog()
    fireEvent.change(screen.getByLabelText(/^RUC/i), {
      target: { value: '20a' },
    })
    expect(await screen.findByText('*Formato inválido.*')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Registrar Proveedor' })).toBeDisabled()
    expect(onExito).not.toHaveBeenCalled()
  })

  it('autocompleta datos fiscales al llegar a 11 dígitos no registrados', async () => {
    renderDialog()
    fireEvent.change(screen.getByLabelText(/^RUC/i), {
      target: { value: '20900000001' },
    })
    expect(
      await screen.findByDisplayValue('Nuevo Sol S.A.C.', {}, { timeout: 4000 }),
    ).toBeInTheDocument()
    expect(screen.getByDisplayValue('Nuevo Sol')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Av. Nueva 100')).toBeInTheDocument()
    expect(screen.getByLabelText(/nombre de contacto/i)).not.toBeDisabled()
  })

  it('resalta errores de validación al enviar con contacto incompleto', async () => {
    const { onExito } = renderDialog()
    fireEvent.change(screen.getByLabelText(/^RUC/i), {
      target: { value: '20900000001' },
    })
    expect(
      await screen.findByDisplayValue('Nuevo Sol S.A.C.', {}, { timeout: 4000 }),
    ).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Registrar Proveedor' }))
    expect(await screen.findByText('El nombre de contacto es obligatorio.')).toBeInTheDocument()
    expect(screen.getByText('El correo electrónico es obligatorio.')).toBeInTheDocument()
    expect(onExito).not.toHaveBeenCalled()
    await waitFor(() => {
      expect(useToastStore.getState().toasts).toHaveLength(0)
    })
  })

  it('avisa duplicado de inmediato sin autocompletar y bloquea todo', async () => {
    const { onExito } = renderDialog()
    fireEvent.change(screen.getByLabelText(/^RUC/i), {
      target: { value: '20500112233' },
    })
    expect(
      await screen.findByText('*El RUC ya se encuentra registrado en el sistema.*', {}, { timeout: 4000 }),
    ).toBeInTheDocument()
    expect(screen.queryByDisplayValue('Textiles Lima S.A.C.')).not.toBeInTheDocument()
    expect(screen.getByLabelText(/nombre de contacto/i)).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Registrar Proveedor' })).toBeDisabled()
    expect(onExito).not.toHaveBeenCalled()
  })

  it('bloquea el envío con error fiscal y ofrece Reintentar', async () => {
    renderDialog()
    fireEvent.change(screen.getByLabelText(/^RUC/i), {
      target: { value: '20987654321' },
    })
    expect(
      await screen.findByRole('button', { name: 'Reintentar' }, { timeout: 4000 }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Registrar Proveedor' })).toBeDisabled()
  })

  it('guarda un proveedor nuevo, notifica el éxito y avisa al padre', async () => {
    const { onExito } = renderDialog()
    fireEvent.change(screen.getByLabelText(/^RUC/i), {
      target: { value: '20900000001' },
    })
    expect(
      await screen.findByDisplayValue('Nuevo Sol S.A.C.', {}, { timeout: 4000 }),
    ).toBeInTheDocument()
    completarContacto()
    fireEvent.click(screen.getByRole('button', { name: 'Registrar Proveedor' }))
    await waitFor(() => expect(onExito).toHaveBeenCalled(), { timeout: 4000 })
    const creado = onExito.mock.calls[0][0] as Proveedor
    expect(creado.estado).toBe('Activo')
    expect(creado.ruc).toBe('20900000001')
    expect(creado.ciudad).toBe('Lima')
    expect(
      useToastStore.getState().toasts.some((t) => t.tono === 'success'),
    ).toBe(true)
  })
})