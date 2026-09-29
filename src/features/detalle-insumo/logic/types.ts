export interface InsumoDetalle {
  id: string
  codigo: string
  nombre: string
  descripcion?: string
  categoria: string
  unidadMedida: string
  stockActual: number
  stockMinimo: number
  estado: 'Activo' | 'Inactivo'
}

export interface MedidaAlterna {
  id: string
  nombre: string
  abreviatura: string
  /** Cuántos kilogramos equivale 1 unidad de esta medida (ej. 1 taza = 0.25 kg) */
  factorABase: number
  uso: string
  /** La fila "Kilogramo" (factor 1) es la medida base: no se edita ni se elimina */
  esBase?: boolean
}

/** 'GLOBAL' o el código de un almacén, ej. 'ALM-005' */
export type AlcanceAlerta = string

export interface AlertaStock {
  id: string
  alcance: AlcanceAlerta
  minimo: number
  cantidadAReponer?: number
}
