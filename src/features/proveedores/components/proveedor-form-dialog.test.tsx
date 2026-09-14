import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest'
import { useToastStore } from '@/stores/toast-store'
import type { Proveedor } from '../data/types'
import { ProveedorFormDialog } from './proveedor-form-dialog'

function renderDialog({
  onCerrar = vi.fn(),
  onExito = vi.fn(),
  proveedor,
}: {
  onCerrar?: () => void
  onExito?: Mock<(proveedor: Proveedor) => void>
  proveedor?: Proveedor
} = {}) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  render(
    <QueryClientProvider client={queryClient}>
      <ProveedorFormDialog
        abierto
        onCerrar={onCerrar}
        onExito={onExito}
        proveedor={proveedor}
      />
    </QueryClientProvider>,
  )
  return { onCerrar, onExito }
}

const AGRO_ANDINA: Proveedor = {
  id: 'p01',
  nombreComercial: 'Agro Andina',
  ruc: '20123456789',
  razonSocial: 'Agro Andina S.A.C.',
  contactos: [{ nombre: 'María López', telefono: '+51 1 555 0101', email: 'maria@agroandina.pe' }],
  direccion: 'Av. Industrial 120',
  fechaRegistro: '2026-01-15T10:00:00Z',
  condicion: 'Habido',
}

const IMPORTADORA_SUR: Proveedor = {
  id: 'p04',
  nombreComercial: 'Importadora Sur',
  ruc: '20403334455',
  razonSocial: 'Importadora Sur S.A.C.',
  contactos: [{ nombre: 'Luis Rojas', telefono: '+51 84 555 0104', email: 'luis@importadorasur.pe' }],
  direccion: 'Av. Los Incas 300',
  fechaRegistro: '2026-03-02T11:15:00Z',
  condicion: 'Habido',
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

function expandirContacto1() {
  fireEvent.click(screen.getByText('Contacto 1'))
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
    expandirContacto1()
    expect(screen.getByLabelText(/nombre de contacto/i)).toBeDisabled()
    expect(screen.getByLabelText(/dirección/i)).toBeDisabled()
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
    expandirContacto1()
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
    expandirContacto1()
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
    expandirContacto1()
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
    expandirContacto1()
    completarContacto()
    fireEvent.click(screen.getByRole('button', { name: 'Registrar Proveedor' }))
    await waitFor(() => expect(onExito).toHaveBeenCalled(), { timeout: 4000 })
    const creado = onExito.mock.calls[0][0] as Proveedor
    expect(creado.condicion).toBe('En proceso de verificación')
    expect(creado.ruc).toBe('20900000001')
    expect(
      useToastStore.getState().toasts.some((t) => t.tono === 'success'),
    ).toBe(true)
  })
})

describe('ProveedorFormDialog (edición)', () => {
  it('precarga los datos actuales del proveedor', async () => {
    renderDialog({ proveedor: AGRO_ANDINA })
    expect(screen.getByRole('dialog', { name: 'Ver/Editar proveedor' })).toBeInTheDocument()
    expect(screen.getByDisplayValue('20123456789')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Agro Andina')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Agro Andina S.A.C.')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Av. Industrial 120')).toBeInTheDocument()
    expect(screen.getByText('María López')).toBeInTheDocument()
    fireEvent.click(screen.getByText('María López'))
    expect(await screen.findByDisplayValue('María López')).toBeInTheDocument()
  })

  it('no marca duplicado con el RUC propio y habilita el formulario', async () => {
    renderDialog({ proveedor: AGRO_ANDINA })
    fireEvent.click(screen.getByText('María López'))
    await waitFor(
      () => {
        expect(screen.getByLabelText(/nombre de contacto/i)).not.toBeDisabled()
      },
      { timeout: 4000 },
    )
    expect(
      screen.queryByText('*El RUC ya se encuentra registrado en el sistema.*'),
    ).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Guardar cambios' })).not.toBeDisabled()
  })

  it('guarda los cambios, notifica y avisa al padre', async () => {
    const { onExito } = renderDialog({ proveedor: AGRO_ANDINA })
    fireEvent.click(screen.getByText('María López'))
    await waitFor(
      () => {
        expect(screen.getByLabelText(/teléfono/i)).not.toBeDisabled()
      },
      { timeout: 4000 },
    )
    fireEvent.change(screen.getByLabelText(/teléfono/i), {
      target: { value: '+51 1 555 0707' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }))
    await waitFor(() => expect(onExito).toHaveBeenCalled(), { timeout: 4000 })
    const actualizado = onExito.mock.calls[0][0] as Proveedor
    expect(actualizado.id).toBe('p01')
    expect(actualizado.contactos[0]?.telefono).toBe('+51 1 555 0707')
    expect(
      useToastStore.getState().toasts.some(
        (t) => t.tono === 'success' && t.mensaje === 'Proveedor actualizado correctamente.',
      ),
    ).toBe(true)
  })

  it('bloquea el RUC, nombre comercial, razón social y dirección en edición', async () => {
    renderDialog({ proveedor: AGRO_ANDINA })
    expect(screen.getByLabelText(/^RUC/i)).toBeDisabled()
    expect(screen.getByLabelText(/nombre comercial/i)).toBeDisabled()
    expect(screen.getByLabelText(/razón social/i)).toBeDisabled()
    expect(screen.getByLabelText(/dirección/i)).toBeDisabled()
    fireEvent.click(screen.getByText('María López'))
    await waitFor(
      () => {
        expect(screen.getByLabelText(/nombre de contacto/i)).not.toBeDisabled()
      },
      { timeout: 4000 },
    )
  })

  it('no consulta datos fiscales en edición aunque el RUC no los tenga', async () => {
    renderDialog({ proveedor: IMPORTADORA_SUR })
    fireEvent.click(screen.getByText('Luis Rojas'))
    await waitFor(
      () => {
        expect(screen.getByLabelText(/nombre de contacto/i)).not.toBeDisabled()
      },
      { timeout: 4000 },
    )
    expect(screen.queryByText(/No se encontraron datos fiscales/)).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Reintentar' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Guardar cambios' })).not.toBeDisabled()
  })
})