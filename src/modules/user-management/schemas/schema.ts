import { z } from 'zod';

// Alineado al CreateWorkerDto real del backend: separa name/lastName
// (antes solo había "name" y el modal concatenaba nombre+apellido en un
// solo string, lo cual el backend no acepta).
export const UserInviteSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  email: z.string().email('Correo electrónico inválido'),
  role: z.enum([
    'anfitrion',
    'mozo',
    'cocinero',
    'asistente_de_cocina',
    'almacenero',
    'jefe',
    'administrador',
  ], {
    message: 'Selecciona un rol válido',
  }),
});

export type UserInviteFormValues = z.infer<typeof UserInviteSchema>;
