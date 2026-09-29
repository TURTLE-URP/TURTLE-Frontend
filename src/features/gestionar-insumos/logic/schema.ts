import { z } from 'zod';

export const insumoSchema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  descripcion: z.string().optional(),
  unidadMedida: z.string().min(1, 'La unidad es obligatoria'),
  etiquetas: z.array(z.string()).optional().default([]),
});

export type InsumoFormValues = z.infer<typeof insumoSchema>;