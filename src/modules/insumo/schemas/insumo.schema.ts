import { z } from 'zod'

/**
 * Form de insumo = DTO del backend.
 * Solo existen los campos que el Swagger expone en Create/UpdateSupplyDto.
 * `id_unidad_base` se elige del catálogo GET /supplies/units/base.
 */
export const insumoSchema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  descripcion: z.string().optional(),
  id_unidad_base: z.coerce.number().int().positive('Debe ser un ID válido mayor a 0'),
})

export type InsumoFormValues = z.infer<typeof insumoSchema>

export const USOS_MEDIDA = ['todo', 'receta', 'productos_proveedor'] as const

export const medidaAlternaSchema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  abreviatura: z.string().min(1, 'La abreviatura es obligatoria'),
  // El backend acepta decimales > 0 (ej. 0.25). El Swagger dice minimum 1 pero es incorrecto.
  factorABase: z.coerce.number().positive('Debe ser mayor a 0'),
  uso: z.enum(USOS_MEDIDA, { error: 'Selecciona un uso válido' }),
})

export type MedidaAlternaFormValues = z.infer<typeof medidaAlternaSchema>

export const alertaStockSchema = z.object({
  alcance: z.string().min(1, 'El alcance es obligatorio'),
  minimo: z.coerce.number().min(1, 'Debe ser mayor a 0'),
  cantidadAReponer: z.coerce.number().min(1, 'Debe ser mayor a 0').optional(),
})

export type AlertaStockFormValues = z.infer<typeof alertaStockSchema>
