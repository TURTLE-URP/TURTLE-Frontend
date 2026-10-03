import { createFileRoute } from '@tanstack/react-router';
import { InventoryKardexPage } from '@/features/inventory-kardex/components/inventory-kardex-page';

export const Route = createFileRoute('/kardex')({
  component: KardexRouteComponent,
  errorComponent: () => (
    <div className="p-8 text-center space-y-4">
      <h2 className="text-xl font-bold text-red-600">Ocurrió un error al cargar el Kardex</h2>
      <p className="text-sm text-gray-600">Por favor, recarga la página o verifica la consola.</p>
    </div>
  ),
});

function KardexRouteComponent() {
  return <InventoryKardexPage />;
}
