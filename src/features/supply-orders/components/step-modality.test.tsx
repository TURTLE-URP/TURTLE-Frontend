import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { StepModality } from './step-modality'

describe('StepModality', () => {
  it('renders the three modalities', () => {
    render(<StepModality onSelect={vi.fn()} />)
    expect(screen.getByRole('button', { name: /por platillos/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /por escasez/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /abasto libre/i })).toBeInTheDocument()
  })

  it('calls onSelect with the chosen modality', async () => {
    const onSelect = vi.fn()
    const user = userEvent.setup()
    render(<StepModality onSelect={onSelect} />)
    await user.click(screen.getByRole('button', { name: /abasto libre/i }))
    expect(onSelect).toHaveBeenCalledWith('libre')
  })
})
