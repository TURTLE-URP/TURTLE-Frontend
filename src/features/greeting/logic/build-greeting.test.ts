import { describe, expect, it } from 'vitest'
import { buildGreeting } from './build-greeting'

describe('buildGreeting', () => {
  it('returns a morning greeting before 12', () => {
    expect(buildGreeting('Anna', 9)).toBe('Good morning, Anna!')
  })

  it('switches to afternoon at 12', () => {
    expect(buildGreeting('Anna', 12)).toBe('Good afternoon, Anna!')
  })

  it('returns an afternoon greeting in the afternoon', () => {
    expect(buildGreeting('Anna', 15)).toBe('Good afternoon, Anna!')
  })

  it('switches to evening at 18', () => {
    expect(buildGreeting('Anna', 18)).toBe('Good evening, Anna!')
  })

  it('returns an evening greeting late in the day', () => {
    expect(buildGreeting('Anna', 23)).toBe('Good evening, Anna!')
  })

  it('trims the name', () => {
    expect(buildGreeting('  Anna  ', 9)).toBe('Good morning, Anna!')
  })

  it('falls back to a greeting without a name when the name is empty', () => {
    expect(buildGreeting('   ', 9)).toBe('Good morning!')
  })

  it('truncates names longer than 50 characters', () => {
    expect(buildGreeting('a'.repeat(60), 9)).toBe(`Good morning, ${'a'.repeat(50)}!`)
  })

  it('clamps negative hours to 0', () => {
    expect(buildGreeting('Anna', -4)).toBe('Good morning, Anna!')
  })

  it('clamps hours above 23 to 23', () => {
    expect(buildGreeting('Anna', 48)).toBe('Good evening, Anna!')
  })

  it('floors non-integer hours', () => {
    expect(buildGreeting('Anna', 17.9)).toBe('Good afternoon, Anna!')
  })
})
