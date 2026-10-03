import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

export const Route = createFileRoute('/inventario')({
  component: InventarioRouteComponent,
});

function InventarioRouteComponent() {
  const [searchTerm, setSearchTerm] = useState('');

  const insumosList = [
    { id: '1', codigo: 'INS-001', nombre: 'Leche entera', categoria: 'Lácteos', stockGlobal: '35 L', puntoReposicion: '20 L (Margen de 15 L)', estado: 'Suficiente', lote: '20 L', almacenesAtencion: '1 almacén requiere atención' },
    { id: '2', codigo: 'INS-014', nombre: 'Harina de trigo', categoria: 'Abarrotes', stockGlobal: '23 kg', puntoReposicion: '25 kg (2 kg bajo el punto)', estado: 'Por reponer', lote: '50 kg', almacenesAtencion: '1 almacén requiere atención' },
    { id: '3', codigo: 'INS-032', nombre: 'Filete de lenguado', categoria: 'Pescados', stockGlobal: '0 kg', puntoReposicion: 'No configurado', estado: 'Sin stock', lote: 'Sin configurar', almacenesAtencion: '3 almacenes requieren atención' },
    { id: '4', codigo: 'INS-019', nombre: 'Aceite de oliva', categoria: 'Abarrotes', stockGlobal: '34 L', puntoReposicion: '34 L (Umbral alcanzado)', estado: 'Reponer ahora', lote: '12 L', almacenesAtencion: 'Actualizado ayer, 17:25' },
  ];

  const getBadgeStyle = (estado: string) => {
    switch(estado) {
      case 'Suficiente': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Por reponer': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Sin stock': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Reponer ahora': return 'bg-orange-50 text-orange-700 border-orange-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="p-8 space-y-6 bg-background min-h-screen text-foreground">
      {/* HEADER */}
      <div>
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          GESTIÓN &bull; INVENTARIO
        </span>
        <h1 className="text-2xl font-bold text-foreground">Inventario</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Compra por estado global y redistribuye según las necesidades de cada almacén.
        </p>
      </div>

      {/* FILTROS Y TARJETAS DE ESTADO */}
      <div className="bg-card border border-border rounded-xl p-4 shadow-2xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-muted-foreground uppercase">Vista de almacén</label>
            <select className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs">
              <option>Todos los almacenes</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-muted-foreground uppercase">Buscar insumo</label>
            <input 
              type="text" 
              placeholder="Nombre, código o categoría..." 
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Tarjetas KPI */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="bg-emerald-50/60 border border-emerald-200/60 p-3 rounded-lg flex items-center justify-between">
            <div>
              <span className="text-[10px] text-emerald-700 font-medium uppercase block">Suficiente</span>
              <span className="text-base font-bold text-emerald-900">1 <span className="text-xs font-normal">Sobre el punto</span></span>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          </div>

          <div className="bg-amber-50/60 border border-amber-200/60 p-3 rounded-lg flex items-center justify-between">
            <div>
              <span className="text-[10px] text-amber-700 font-medium uppercase block">Por reponer</span>
              <span className="text-base font-bold text-amber-900">2 <span className="text-xs font-normal">Requieren atención</span></span>
            </div>
            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
          </div>

          <div className="bg-rose-50/60 border border-rose-200/60 p-3 rounded-lg flex items-center justify-between">
            <div>
              <span className="text-[10px] text-rose-700 font-medium uppercase block">Sin stock</span>
              <span className="text-base font-bold text-rose-900">1 <span className="text-xs font-normal">Acción urgente</span></span>
            </div>
            <div className="w-2 h-2 rounded-full bg-rose-500"></div>
          </div>

          <div className="bg-zinc-50 border border-zinc-200 p-3 rounded-lg flex items-center justify-between">
            <div>
              <span className="text-[10px] text-zinc-600 font-medium uppercase block">Sin monitoreo</span>
              <span className="text-base font-bold text-zinc-900">1 <span className="text-xs font-normal">Punto no configurado</span></span>
            </div>
            <div className="w-2 h-2 rounded-full bg-zinc-400"></div>
          </div>
        </div>
      </div>

      {/* LISTADO DE EXISTENCIAS */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-2xs space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-border">
          <div>
            <h2 className="text-base font-bold text-foreground">Existencias</h2>
            <p className="text-[11px] text-muted-foreground">5 insumos - Todos los almacenes</p>
          </div>
        </div>

        <div className="space-y-3">
          {insumosList.map((item) => (
            <div key={item.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-3 rounded-lg border border-border/60 hover:bg-muted/40 transition-colors gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-md bg-muted flex items-center justify-center font-bold text-xs text-muted-foreground">
                  {item.nombre.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">{item.nombre}</h4>
                  <span className="text-[11px] text-muted-foreground font-mono">{item.codigo} &bull; {item.categoria}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-xs w-full md:w-auto">
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase block">Stock global</span>
                  <span className="font-bold text-foreground text-sm">{item.stockGlobal}</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase block">Punto de reposición</span>
                  <span className="font-medium text-foreground">{item.puntoReposicion}</span>
                </div>
                <div>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium border ${getBadgeStyle(item.estado)}`}>
                    {item.estado}
                  </span>
                  <span className="text-[10px] text-muted-foreground block mt-0.5">{item.almacenesAtencion}</span>
                </div>
                <div className="flex items-center justify-end gap-3">
                  <div className="text-right">
                    <span className="text-[10px] text-muted-foreground uppercase block">Lote</span>
                    <span className="font-medium text-foreground">{item.lote}</span>
                  </div>
                  <a 
                    href="/kardex" 
                    className="px-3 py-1.5 rounded-md border border-border bg-background text-xs font-semibold hover:bg-muted transition-colors flex items-center gap-1"
                  >
                    Ver kardex &rarr;
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
