import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ToastRegion } from '@/features/proveedores/components/toast'
import { ProveedoresRoute } from './proveedores'

function renderPagina() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <ProveedoresRoute />
      <ToastRegion />
    </QueryClientProvider>,
  )
}

describe('ProveedoresRoute (US1)', () => {
  it('carga el listado del mock: 10 filas numeradas en la página 1', async () => {
    renderPagina()
    expect(await screen.findByText('Agro Andina', {}, { timeout: 4000 })).toBeInTheDocument()
    expect(screen.getAllByRole('row')).toHaveLength(11) // cabecera + 10 filas
    expect(screen.getByText('001')).toBeInTheDocument()
    expect(screen.getByText('010')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '1' })).toHaveAttribute('aria-current', 'page')
  })

  it('filtra por búsqueda ("andina")', async () => {
    renderPagina()
    const input = await screen.findByPlaceholderText('Buscar por nombre, RUC, contacto...')
    fireEvent.change(input, { target: { value: 'andina' } })
    expect(
      await screen.findByText('Construcción Andina', {}, { timeout: 4000 }),
    ).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.getAllByRole('row')).toHaveLength(3) // cabecera + 2 filas
    })
    expect(screen.getAllByRole('row')).toHaveLength(3) // cabecera + 2 filas
    expect(screen.getByText('Agro Andina')).toBeInTheDocument()
    expect(screen.queryByText('Frutas del Valle')).not.toBeInTheDocument()
  })

  it('cambia de página con la paginación numerada sin destello de carga', async () => {
    renderPagina()
    expect(await screen.findByText('Agro Andina', {}, { timeout: 4000 })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: '2' }))
    expect(
      await screen.findByText('Alimentos Pura Vida', {}, { timeout: 4000 }),
    ).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.getByText('011')).toBeInTheDocument()
    })
    expect(screen.getByRole('button', { name: '2' })).toHaveAttribute('aria-current', 'page')
    expect(screen.queryByText('Agro Andina')).not.toBeInTheDocument()
  })

  it('edita un proveedor: notificación de éxito (US3)', async () => {
    renderPagina()
    expect(await screen.findByText('Agro Andina', {}, { timeout: 4000 })).toBeInTheDocument()
    fireEvent.click(screen.getAllByRole('button', { name: 'Ver/Editar' })[0])
    expect(
      await screen.findByRole('dialog', { name: 'Ver/Editar proveedor' }, { timeout: 4000 }),
    ).toBeInTheDocument()
    fireEvent.click(screen.getByText('María López'))
    expect(await screen.findByDisplayValue('María López')).toBeInTheDocument()
    await waitFor(
      () => {
        expect(screen.getByRole('button', { name: 'Guardar cambios' })).not.toBeDisabled()
      },
      { timeout: 4000 },
    )
    fireEvent.change(screen.getByDisplayValue('María López'), {
      target: { value: 'María López Vega' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }))
    await waitFor(
      () => {
        expect(screen.getByText('Proveedor actualizado correctamente.')).toBeInTheDocument()
      },
      { timeout: 4000 },
    )
    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'Ver/Editar proveedor' })).not.toBeInTheDocument()
    })
    expect(screen.getByText('Agro Andina')).toBeInTheDocument()
  })

  it('registra un proveedor nuevo: fila Activo + notificación (US2)', async () => {
    renderPagina()
    expect(await screen.findByText('Agro Andina', {}, { timeout: 4000 })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Nuevo Proveedor' }))
    expect(
      await screen.findByRole('dialog', { name: 'Nuevo proveedor' }, { timeout: 4000 }),
    ).toBeInTheDocument()
    fireEvent.change(screen.getByLabelText(/^RUC/i), {
      target: { value: '20900000001' },
    })
    expect(
      await screen.findByDisplayValue('Nuevo Sol S.A.C.', {}, { timeout: 4000 }),
    ).toBeInTheDocument()
    fireEvent.click(screen.getByText('Contacto 1'))
    fireEvent.change(screen.getByLabelText(/nombre de contacto/i), {
      target: { value: 'Sol Pérez' },
    })
    fireEvent.change(screen.getByLabelText(/teléfono/i), {
      target: { value: '+51 1 555 0188' },
    })
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: 'sol@nuevosol.pe' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Registrar Proveedor' }))
    await waitFor(
      () => {
        expect(screen.getByText('Proveedor registrado correctamente.')).toBeInTheDocument()
      },
      { timeout: 4000 },
    )
    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'Nuevo proveedor' })).not.toBeInTheDocument()
    })
    fireEvent.click(screen.getByRole('button', { name: 'Última página' }))
    expect(await screen.findByText('Nuevo Sol', {}, { timeout: 4000 })).toBeInTheDocument()
  })
})