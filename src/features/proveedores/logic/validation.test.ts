import { describe, expect, it } from 'vitest'
import type { ProveedorInput } from '../data/types'
import { esEmailValido, esRucValido, esTelefonoValido, validarProveedor } from './validation'

const VALIDO: ProveedorInput = {
  nombreComercial: 'Agro Andina',
  ruc: '20123456789',
  razonSocial: 'Agro Andina S.A.C.',
  contactos: [{ nombre: 'María López', telefono: '+51 1 555 0101', email: 'maria@agroandina.pe' }],
  direccion: 'Av. Industrial 120',
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

  it('devuelve error si no hay contactos', () => {
    const errores = validarProveedor({
      nombreComercial: 'Test',
      ruc: '20123456789',
      razonSocial: 'Test S.A.C.',
      contactos: [],
      direccion: 'Av. Test 1',
    })
    expect(errores.contactos).toBe('Debe haber al menos un contacto.')
  })

  it('devuelve error si hay más de 5 contactos', () => {
    const contactos = Array.from({ length: 6 }, () => ({
      nombre: 'Test',
      telefono: '+51 1 555 0000',
      email: 'test@test.pe',
    }))
    const errores = validarProveedor({
      nombreComercial: 'Test',
      ruc: '20123456789',
      razonSocial: 'Test S.A.C.',
      contactos,
      direccion: 'Av. Test 1',
    })
    expect(errores.contactos).toBe('No puede haber más de 5 contactos.')
  })

  it('devuelve errores individuales por contacto', () => {
    const errores = validarProveedor({
      nombreComercial: 'Test',
      ruc: '20123456789',
      razonSocial: 'Test S.A.C.',
      contactos: [{ nombre: '', telefono: '', email: '' }],
      direccion: 'Av. Test 1',
    })
    expect(errores.contactosDetalle).toBeDefined()
    expect(errores.contactosDetalle?.[0]?.nombre).toBeDefined()
    expect(errores.contactosDetalle?.[0]?.telefono).toBeDefined()
    expect(errores.contactosDetalle?.[0]?.email).toBeDefined()
  })

  it('señala RUC con mensaje específico', () => {
    const errores = validarProveedor({ ...VALIDO, ruc: '123' })
    expect(errores.ruc).toBe('El RUC debe tener 11 dígitos.')
  })
})