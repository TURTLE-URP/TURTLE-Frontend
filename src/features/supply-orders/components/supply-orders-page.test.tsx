import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { SupplyOrdersPage } from './supply-orders-page'
import type { HistoryEntry, SupplyKpis } from '../logic/types'

const kpiState = vi.hoisted(() => ({
  isPending: false,
  isError: false,
  data: null as SupplyKpis | null,
}))

const historyState = vi.hoisted(() => ({
  isPending: false,
  isError: false,
  data: [] as HistoryEntry[],
}))

vi.mock('../logic/api/hooks', () => ({
  useKpis: () => kpiState,
  useSupplyOrders: () => historyState,
  useCatalog: () => ({ data: null }),
  useCalculateItems: () => ({ mutateAsync: vi.fn() }),
  useShortageItems: () => ({ data: [], isPending: false, isError: false }),
  useEmitOrders: () => ({ mutateAsync: vi.fn() }),
}))

function resetState() {
  kpiState.isPending = false
  kpiState.isError = false
  kpiState.data = {
    ordersMonth: 7,
    pendingAgreements: 2,
    spendPeriod: 1108,
    shortageIngredients: 8,
  }
  historyState.isPending = false
  historyState.isError = false
  historyState.data = [
    {
      id: 'OA-0010',
      supplier: 'Carnes Premium SRL',
      date: '2026-07-18',
      status: 'Entregada',
      total: 216,
      products: 1,
    },
  ]
}

describe('SupplyOrdersPage', () => {
  beforeEach(() => {
    resetState()
  })

  it('renders KPIs, filters and history from the hooks', () => {
    render(<SupplyOrdersPage />)
    expect(screen.getByText('Órdenes este mes')).toBeInTheDocument()
    expect(screen.getByText('S/ 1,108.00')).toBeInTheDocument()
    expect(screen.getByText('OA-0010')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Todas' })).toBeInTheDocument()
  })

  it('shows a loading region while data is pending', () => {
    kpiState.isPending = true
    historyState.isPending = true
    render(<SupplyOrdersPage />)
    expect(screen.getByRole('status', { name: /cargando/i })).toBeInTheDocument()
  })

  it('shows an error alert when data fails to load', () => {
    kpiState.isError = true
    render(<SupplyOrdersPage />)
    expect(screen.getByRole('alert')).toHaveTextContent(/error/i)
  })

  it('shows the empty state when there is no history', () => {
    historyState.data = []
    render(<SupplyOrdersPage />)
    expect(screen.getByText(/aún no hay órdenes/i)).toBeInTheDocument()
  })

  it('renders the wizard trigger button', () => {
    render(<SupplyOrdersPage />)
    expect(screen.getByRole('button', { name: /emitir orden/i })).toBeInTheDocument()
  })
})
