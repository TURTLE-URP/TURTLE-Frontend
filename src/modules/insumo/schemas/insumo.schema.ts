import { z } from 'zod'

export const insumoSchema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  categoria: z.enum([
    'Mariscos',
    'Pescados',
    'Verduras',
    'Condimentos',
    'Bebidas',
    'Envases',
    'Abarrotes',
  ]),
  descripcion: z.string().optional(),
  stockActual: z.coerce.number().min(0, 'Debe ser mayor o igual a 0'),
  stockMinimo: z.coerce.number().min(0, 'Debe ser mayor o igual a 0'),
  stockAbasto: z.coerce.number().min(0, 'Debe ser mayor o igual a 0'),
  unidadMedida: z.string().min(1, 'La unidad es obligatoria'),
  fechaVencimiento: z.string().optional(),
  etiquetas: z.array(z.string()).optional().default([]),
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
