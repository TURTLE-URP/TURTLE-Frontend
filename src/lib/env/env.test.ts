import { describe, expect, it } from 'vitest'
import { validateEnv } from './env'

describe('validateEnv', () => {
  it('throws when a required variable is missing', () => {
    expect(() => validateEnv({})).toThrow(/VITE_APP_NAME/)
  })

  it('throws when a required variable is empty or whitespace', () => {
    expect(() => validateEnv({ VITE_APP_NAME: '   ' })).toThrow(/VITE_APP_NAME/)
  })

  it('throws when VITE_APP_NAME exceeds 50 characters', () => {
    expect(() => validateEnv({ VITE_APP_NAME: 'a'.repeat(51) })).toThrow(/50 characters/)
  })

  it('defaults VITE_API_BASE_URL to an empty string', () => {
    expect(validateEnv({ VITE_APP_NAME: 'Turtle' }).VITE_API_BASE_URL).toBe('')
  })

  it('trims the app name', () => {
    expect(validateEnv({ VITE_APP_NAME: '  Turtle  ' }).VITE_APP_NAME).toBe('Turtle')
  })

  it('throws when VITE_API_BASE_URL is not an absolute URL', () => {
    expect(() => validateEnv({ VITE_APP_NAME: 'Turtle', VITE_API_BASE_URL: 'not-a-url' })).toThrow(
      /absolute URL/,
    )
  })

  it('throws when VITE_API_BASE_URL is not http(s)', () => {
    expect(() =>
      validateEnv({ VITE_APP_NAME: 'Turtle', VITE_API_BASE_URL: 'ftp://example.com' }),
    ).toThrow(/http/)
  })

  it('returns the parsed config for valid input', () => {
    const config = validateEnv({
      VITE_APP_NAME: 'Turtle',
      VITE_API_BASE_URL: 'https://api.example.com',
    })
    expect(config).toEqual({
      VITE_APP_NAME: 'Turtle',
      VITE_API_BASE_URL: 'https://api.example.com',
    })
  })
})
