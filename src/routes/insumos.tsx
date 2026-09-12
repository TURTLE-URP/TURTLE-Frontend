import { createFileRoute } from '@tanstack/react-router';
import { GestionarInsumosPage } from '@/features/gestionar-insumos/components/gestionar-insumo.page';
export const Route = createFileRoute('/insumos')({
  component: GestionarInsumosPage,
});