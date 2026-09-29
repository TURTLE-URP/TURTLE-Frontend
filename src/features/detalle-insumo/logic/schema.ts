import { z } from 'zod'

export const medidaAlternaSchema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  abreviatura: z.string().min(1, 'La abreviatura es obligatoria'),
  factorABase: z.coerce.number().positive('Debe ser mayor a 0'),
  uso: z.string().min(1, 'Selecciona un uso'),
})

export type MedidaAlternaFormValues = z.infer<typeof medidaAlternaSchema>

export const alertaStockSchema = z.object({
  alcance: z.string().min(1, 'El alcance es obligatorio'),
  minimo: z.coerce.number().min(0, 'Debe ser mayor o igual a 0'),
  cantidadAReponer: z.coerce.number().min(0, 'Debe ser mayor o igual a 0').optional(),
})

export type AlertaStockFormValues = z.infer<typeof alertaStockSchema>
