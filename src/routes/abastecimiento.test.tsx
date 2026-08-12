import { render, screen } from '@testing-library/react'
import { createMemoryHistory, Router, RouterProvider } from '@tanstack/react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AppProviders } from '../app/providers'
import { routeTree } from '../routeTree.gen'

const roleState = vi.hoisted(() => ({ role: 'admin' as 'admin' | 'staff' }))

vi.mock('../features/supply-orders/logic/role', () => {
  class RoleAccessDeniedError extends Error {
    override readonly name = 'RoleAccessDeniedError'

    constructor() {
      super('Access denied: administrator role required')
    }
  }

  return {
    RoleAccessDeniedError,
    getCurrentRole: () => roleState.role,
    requireAdmin: (role: 'admin' | 'staff' = roleState.role) => {
      if (role !== 'admin') {
        throw new RoleAccessDeniedError()
      }
    },
  }
})

function renderAtAbastecimiento() {
  const router = new Router({
    routeTree,
    history: createMemoryHistory({ initialEntries: ['/abastecimiento'] }),
  })
  return render(
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>,
  )
}

describe('Route guard /abastecimiento', () => {
  beforeEach(() => {
    roleState.role = 'admin'
  })

  it('renders the supply orders page for an admin', async () => {
    renderAtAbastecimiento()
    expect(
      await screen.findByRole('heading', { name: 'Órdenes de Abastecimiento' }),
    ).toBeInTheDocument()
  })

  it('redirects non-admin users to the home page', async () => {
    roleState.role = 'staff'
    renderAtAbastecimiento()

    expect(await screen.findByText('Welcome to the scaffold')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Órdenes de Abastecimiento' })).not.toBeInTheDocument()
  })
})
