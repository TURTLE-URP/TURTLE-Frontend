import { z } from 'zod'

function hasPositiveQuantity(values: Record<string, number>): boolean {
  return Object.values(values).some((value) => value > 0)
}

export const libreSchema = z
  .object({ quantities: z.record(z.string(), z.number()) })
  .refine((value) => hasPositiveQuantity(value.quantities), {
    message: 'Ingresa al menos una cantidad mayor a 0',
    path: ['quantities'],
  })

export const dishQtysSchema = z
  .object({ dishQtys: z.record(z.string(), z.number()) })
  .refine((value) => hasPositiveQuantity(value.dishQtys), {
    message: 'Selecciona al menos un platillo con cantidad mayor a 0',
    path: ['dishQtys'],
  })

export const escasezSchema = z.object({})

export type LibreFormValues = z.infer<typeof libreSchema>
export type DishQtysFormValues = z.infer<typeof dishQtysSchema>
export type EscasezFormValues = z.infer<typeof escasezSchema>
