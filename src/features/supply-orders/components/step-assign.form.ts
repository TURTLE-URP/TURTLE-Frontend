import { z } from 'zod'

export function buildAssignSchema(ingredientIds: string[]) {
  return z
    .object({ selections: z.record(z.string(), z.string()) })
    .refine(
      (value) =>
        ingredientIds.every(
          (id) => value.selections[id] !== undefined && value.selections[id].length > 0,
        ),
      { message: 'Asigna un producto a cada insumo para continuar.', path: ['selections'] },
    )
}

export const assignSchema = buildAssignSchema([])

export type AssignFormValues = z.infer<typeof assignSchema>
