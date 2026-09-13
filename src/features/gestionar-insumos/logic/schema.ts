import { z } from 'zod';

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
});

export type InsumoFormValues = z.infer<typeof insumoSchema>;