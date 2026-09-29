import { z } from 'zod';

export const insumoSchema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  descripcion: z.string().optional(),
  unidadMedida: z.string().min(1, 'La unidad es obligatoria'),
  // Opcional: un input vacío se trata como "sin vencimiento"
  diasVencimiento: z.preprocess(
    (v) => (v === '' || v === null || v === undefined || Number.isNaN(v) ? undefined : v),
    z.coerce
      .number()
      .int('Debe ser un número entero')
      .min(1, 'Debe ser mayor a 0')
      .optional(),
  ),
  // Categorización múltiple con etiquetas
  etiquetas: z.array(z.string()).optional().default([]),
});

export type InsumoFormValues = z.infer<typeof insumoSchema>;