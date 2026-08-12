import { describe, expect, it } from 'vitest'
import { getCurrentRole, requireAdmin, RoleAccessDeniedError } from './role'

describe('getCurrentRole', () => {
  it('returns a known role', () => {
    expect(['admin', 'staff']).toContain(getCurrentRole())
  })
})

describe('requireAdmin', () => {
  it('passes for an admin role', () => {
    expect(() => requireAdmin('admin')).not.toThrow()
  })

  it('throws RoleAccessDeniedError for a non-admin role', () => {
    expect(() => requireAdmin('staff')).toThrow(RoleAccessDeniedError)
  })
})
