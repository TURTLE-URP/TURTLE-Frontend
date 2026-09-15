import { describe, expect, it } from 'vitest'
import { validateCredentials } from './validate-credentials'

describe('validateCredentials', () => {
  it('accepts a valid email and password', () => {
    expect(validateCredentials('ana@turtle.pe', 'secret1')).toEqual({ ok: true })
  })

  it('rejects an empty email', () => {
    const result = validateCredentials('  ', 'secret1')
    expect(result.ok).toBe(false)
    expect(result.emailError).toMatch(/correo/i)
  })

  it('rejects a malformed email', () => {
    const result = validateCredentials('ana-at-turtle', 'secret1')
    expect(result.ok).toBe(false)
    expect(result.emailError).toMatch(/válido/i)
  })

  it('rejects a short password', () => {
    const result = validateCredentials('ana@turtle.pe', '123')
    expect(result.ok).toBe(false)
    expect(result.passwordError).toMatch(/6/)
  })
})
