import { createFileRoute } from '@tanstack/react-router';
import { GestionarInsumosPage } from '@/modules/gestionar-insumos/pages/gestionar-insumo.page';
export const Route = createFileRoute('/insumos')({
  component: GestionarInsumosPage,
});