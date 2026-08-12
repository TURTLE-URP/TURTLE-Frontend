import { z } from 'zod'

export const modalitySchema = z.object({
  modality: z.enum(['platillos', 'escasez', 'libre'], { message: 'Selecciona una modalidad' }),
})

export type ModalityFormValues = z.infer<typeof modalitySchema>
