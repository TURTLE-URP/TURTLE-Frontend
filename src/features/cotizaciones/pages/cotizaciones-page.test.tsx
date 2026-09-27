import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CotizacionesPage } from './cotizaciones-page'

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  render(
    <QueryClientProvider client={queryClient}>
      <CotizacionesPage />
    </QueryClientProvider>,
  )
}

describe('CotizacionesPage (FR-015)', () => {
  it('no expone ningún punto de creación', async () => {
    renderPage()
    await waitFor(
      () => expect(screen.getByRole('columnheader', { name: 'Folio' })).toBeInTheDocument(),
      { timeout: 5000 },
    )
    expect(
      screen.queryByRole('button', { name: /nuev[oa]|crear|registrar/i }),
    ).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /nuev[oa]|crear/i })).not.toBeInTheDocument()
  })
})
