import { describe, expect, it } from 'vitest'
import type { ProveedorInput } from '../data/types'
import { esEmailValido, esRucValido, esTelefonoValido, validarProveedor } from './validation'

const VALIDO: ProveedorInput = {
  nombreComercial: 'Agro Andina',
  ruc: '20123456789',
  razonSocial: 'Agro Andina S.A.C.',
  contactoNombre: 'María López',
  contactoTelefono: '+51 1 555 0101',
  contactoEmail: 'maria@agroandina.pe',
  direccion: 'Av. Industrial 120',
  ciudad: 'Arequipa',
}

describe('esRucValido', () => {
  it('acepta 11 dígitos', () => {
    expect(esRucValido('20123456789')).toBe(true)
  })

  it('rechaza longitudes distintas y no numéricos', () => {
    expect(esRucValido('123')).toBe(false)
    expect(esRucValido('2012345678a')).toBe(false)
    expect(esRucValido('')).toBe(false)
  })

  it('ignora espacios alrededor', () => {
    expect(esRucValido('  20123456789  ')).toBe(true)
  })
})

describe('esEmailValido', () => {
  it('acepta correos bien formados', () => {
    expect(esEmailValido('maria@agroandina.pe')).toBe(true)
  })

  it('rechaza correos mal formados', () => {
    expect(esEmailValido('sin-arroba')).toBe(false)
    expect(esEmailValido('a@b')).toBe(false)
    expect(esEmailValido('')).toBe(false)
  })
})

describe('esTelefonoValido', () => {
  it('acepta teléfonos con código, espacios y guiones', () => {
    expect(esTelefonoValido('+51 1 555 0101')).toBe(true)
    expect(esTelefonoValido('01-555-0101')).toBe(true)
  })

  it('rechaza textos sin dígitos suficientes', () => {
    expect(esTelefonoValido('abc')).toBe(false)
    expect(esTelefonoValido('123')).toBe(false)
    expect(esTelefonoValido('')).toBe(false)
  })
})

describe('validarProveedor', () => {
  it('devuelve un mapa vacío para un input válido', () => {
    expect(validarProveedor(VALIDO)).toEqual({})
  })

  it('devuelve un error por campo para un input vacío', () => {
    const errores = validarProveedor({
      nombreComercial: '',
      ruc: '',
      razonSocial: '',
      contactoNombre: '',
      contactoTelefono: '',
      contactoEmail: '',
      direccion: '',
      ciudad: '',
    })
    expect(Object.keys(errores).sort()).toEqual(
      [
        'ciudad',
        'contactoEmail',
        'contactoNombre',
        'contactoTelefono',
        'direccion',
        'nombreComercial',
        'razonSocial',
        'ruc',
      ].sort(),
    )
  })

  it('señala RUC, email y teléfono con mensajes específicos', () => {
    const errores = validarProveedor({ ...VALIDO, ruc: '123', contactoEmail: 'mal', contactoTelefono: 'abc' })
    expect(errores.ruc).toBe('El RUC debe tener 11 dígitos.')
    expect(errores.contactoEmail).toBe('El correo electrónico no es válido.')
    expect(errores.contactoTelefono).toBe('El teléfono no es válido.')
  })
})