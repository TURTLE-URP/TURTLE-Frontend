import type { Contacto, ProveedorInput } from '../data/types'

export type ErroresProveedor = {
  nombreComercial?: string
  ruc?: string
  razonSocial?: string
  contactos?: string
  direccion?: string
  contactosDetalle?: Array<{ nombre?: string; telefono?: string; email?: string }>
}

const RUC_PATTERN = /^\d{11}$/
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function esRucValido(ruc: string): boolean {
  return RUC_PATTERN.test(ruc.trim())
}

export function esEmailValido(email: string): boolean {
  return EMAIL_PATTERN.test(email.trim())
}

export function esTelefonoValido(telefono: string): boolean {
  const digitos = telefono.replace(/\D/g, '')
  return digitos.length >= 7
}

function validarContacto(contacto: Contacto): { nombre?: string; telefono?: string; email?: string } {
  const errores: { nombre?: string; telefono?: string; email?: string } = {}
  if (contacto.nombre.trim() === '') {
    errores.nombre = 'El nombre de contacto es obligatorio.'
  }
  const telefono = contacto.telefono.trim()
  if (telefono === '') {
    errores.telefono = 'El teléfono es obligatorio.'
  } else if (!esTelefonoValido(telefono)) {
    errores.telefono = 'El teléfono no es válido.'
  }
  const email = contacto.email.trim()
  if (email === '') {
    errores.email = 'El correo electrónico es obligatorio.'
  } else if (!esEmailValido(email)) {
    errores.email = 'El correo electrónico no es válido.'
  }
  return errores
}

export function validarProveedor(input: ProveedorInput): ErroresProveedor {
  const errores: ErroresProveedor = {}

  if (input.nombreComercial.trim() === '') {
    errores.nombreComercial = 'El nombre comercial es obligatorio.'
  }
  const ruc = input.ruc.trim()
  if (ruc === '') {
    errores.ruc = 'El RUC es obligatorio.'
  } else if (!esRucValido(ruc)) {
    errores.ruc = 'El RUC debe tener 11 dígitos.'
  }
  if (input.razonSocial.trim() === '') {
    errores.razonSocial = 'La razón social es obligatoria.'
  }
  if (input.direccion.trim() === '') {
    errores.direccion = 'La dirección es obligatoria.'
  }

  if (!input.contactos || input.contactos.length === 0) {
    errores.contactos = 'Debe haber al menos un contacto.'
  } else if (input.contactos.length > 5) {
    errores.contactos = 'No puede haber más de 5 contactos.'
  } else {
    const detalle = input.contactos.map(validarContacto)
    const hayErrores = detalle.some((e) => e.nombre || e.telefono || e.email)
    if (hayErrores) {
      errores.contactosDetalle = detalle
    }
  }

  return errores
}