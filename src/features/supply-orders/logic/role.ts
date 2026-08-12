import type { Role } from './types'

export class RoleAccessDeniedError extends Error {
  override readonly name = 'RoleAccessDeniedError'

  constructor() {
    super('Access denied: administrator role required')
  }
}

const CURRENT_ROLE: Role = 'admin'

export function getCurrentRole(): Role {
  return CURRENT_ROLE
}

export function requireAdmin(role: Role = getCurrentRole()): void {
  if (role !== 'admin') {
    throw new RoleAccessDeniedError()
  }
}
