import { render, screen } from '@testing-library/react'
import { Package } from '@phosphor-icons/react'
import { describe, expect, it } from 'vitest'
import { KpiCard } from './kpi-card'

describe('KpiCard', () => {
  it('renders label, formatted value and sub', () => {
    render(
      <KpiCard icon={Package} label="Gasto total (julio)" value="S/ 1,108" sub="Entre 4 proveedores" />,
    )
    expect(screen.getByText('Gasto total (julio)')).toBeInTheDocument()
    expect(screen.getByText('S/ 1,108')).toBeInTheDocument()
    expect(screen.getByText('Entre 4 proveedores')).toBeInTheDocument()
  })

  it('renders the given Phosphor icon', () => {
    const { container } = render(
      <KpiCard icon={Package} label="Órdenes este mes" value="7" sub="+2 respecto al mes anterior" />,
    )
    expect(container.querySelector('svg')).not.toBeNull()
  })

  it('applies the destructive accent on value and icon when warn is set', () => {
    render(<KpiCard icon={Package} label="Insumos en escasez" value="8" sub="Bajo stock deseado" warn />)
    expect(screen.getByText('8')).toHaveClass('text-destructive')
    expect(screen.getByText('Insumos en escasez').parentElement?.querySelector('svg')).toHaveClass(
      'text-destructive',
    )
  })

  it('keeps the default muted accents when warn is unset', () => {
    render(<KpiCard icon={Package} label="Órdenes este mes" value="7" sub="+2" />)
    expect(screen.getByText('7')).toHaveClass('text-foreground')
  })
})
