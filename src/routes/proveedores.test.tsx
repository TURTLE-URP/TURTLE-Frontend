import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ProveedoresRoute } from './proveedores'

function renderPagina() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <ProveedoresRoute />
    </QueryClientProvider>,
  )
}

describe('ProveedoresRoute (US1)', () => {
  it('carga el listado del mock: 10 filas numeradas en la página 1', async () => {
    renderPagina()
    expect(await screen.findByText('Agro Andina', {}, { timeout: 4000 })).toBeInTheDocument()
    expect(screen.getAllByRole('row')).toHaveLength(11) // cabecera + 10 filas
    expect(screen.getByText('001')).toBeInTheDocument()
    expect(screen.getByText('Mostrando 1–10 de 25')).toBeInTheDocument()
    expect(screen.getByText('25 proveedores')).toBeInTheDocument()
  })

  it('filtra por búsqueda ("andina")', async () => {
    renderPagina()
    const input = await screen.findByPlaceholderText('Buscar por nombre, RUC, contacto...')
    fireEvent.change(input, { target: { value: 'andina' } })
    expect(
      await screen.findByText('Construcción Andina', {}, { timeout: 4000 }),
    ).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.getByText('Mostrando 1–2 de 2')).toBeInTheDocument()
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
      expect(screen.getByText('Mostrando 11–20 de 25')).toBeInTheDocument()
    })
    expect(screen.getByRole('button', { name: '2' })).toHaveAttribute('aria-current', 'page')
    expect(screen.queryByText('Agro Andina')).not.toBeInTheDocument()
  })
})