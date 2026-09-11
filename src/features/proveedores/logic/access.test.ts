import { describe, expect, it } from 'vitest'
import { puedeGestionarProveedores, ROL_ADMIN } from './access'

describe('puedeGestionarProveedores', () => {
  it('permite el acceso al rol ADMIN', () => {
    expect(puedeGestionarProveedores(ROL_ADMIN)).toBe(true)
  })

  it('deniega el acceso al rol INVITADO', () => {
    expect(puedeGestionarProveedores('INVITADO')).toBe(false)
  })

  it('deniega el acceso cuando la sesión es nula o indefinida', () => {
    expect(puedeGestionarProveedores(null)).toBe(false)
    expect(puedeGestionarProveedores(undefined)).toBe(false)
  })
})