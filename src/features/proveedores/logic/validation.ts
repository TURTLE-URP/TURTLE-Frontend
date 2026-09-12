import type { ProveedorInput } from '../data/types'

export type CampoProveedor = keyof ProveedorInput

export type ErroresProveedor = Partial<Record<CampoProveedor, string>>

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
  if (input.contactoNombre.trim() === '') {
    errores.contactoNombre = 'El nombre de contacto es obligatorio.'
  }
  const telefono = input.contactoTelefono.trim()
  if (telefono === '') {
    errores.contactoTelefono = 'El teléfono es obligatorio.'
  } else if (!esTelefonoValido(telefono)) {
    errores.contactoTelefono = 'El teléfono no es válido.'
  }
  const email = input.contactoEmail.trim()
  if (email === '') {
    errores.contactoEmail = 'El correo electrónico es obligatorio.'
  } else if (!esEmailValido(email)) {
    errores.contactoEmail = 'El correo electrónico no es válido.'
  }
  if (input.direccion.trim() === '') {
    errores.direccion = 'La dirección es obligatoria.'
  }
  if (input.ciudad.trim() === '') {
    errores.ciudad = 'La ciudad es obligatoria.'
  }

  return errores
}