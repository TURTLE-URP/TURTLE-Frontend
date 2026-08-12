import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { WizardProgress } from './wizard-progress'

describe('WizardProgress', () => {
  it('renders the four step labels', () => {
    render(<WizardProgress step={1} />)
    for (const label of ['Modalidad', 'Configurar', 'Asignar', 'Resumen']) {
      expect(screen.getByText(label)).toBeInTheDocument()
    }
  })

  it('marks the current step with aria-current', () => {
    render(<WizardProgress step={2} />)
    const current = screen
      .getAllByRole('listitem')
      .find((item) => item.getAttribute('aria-current') === 'step')
    expect(current).toHaveTextContent('Configurar')
  })

  it('replaces the number of a completed step with a check', () => {
    render(<WizardProgress step={3} />)
    expect(screen.queryByText('1')).not.toBeInTheDocument()
    expect(screen.queryByText('2')).not.toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('4')).toBeInTheDocument()
  })
})
