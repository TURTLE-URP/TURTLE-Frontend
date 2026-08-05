import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { GreetingCard } from './greeting-card'

describe('GreetingCard', () => {
  it('renders the greeting for the given hour', () => {
    render(<GreetingCard name="Anna" hour={9} />)
    expect(screen.getByRole('status')).toHaveTextContent('Good morning, Anna!')
  })

  it('uses the evening period for late hours', () => {
    render(<GreetingCard name="Anna" hour={21} />)
    expect(screen.getByRole('status')).toHaveTextContent('Good evening, Anna!')
  })

  it('falls back to a greeting without a name', () => {
    render(<GreetingCard name="   " hour={9} />)
    expect(screen.getByRole('status')).toHaveTextContent('Good morning!')
  })

  it('exposes the greeting as a live status region', () => {
    render(<GreetingCard name="Anna" hour={9} />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })
})
