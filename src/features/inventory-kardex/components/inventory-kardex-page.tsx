import { useMemo, useState } from 'react';
import { ALMACENES_MOCK } from '../../../modules/almacen/lib/mock-almacenes';
import { INSUMOS_FIXTURE } from '../fixtures/insumos.fixtures';
import { KardexTable } from './kardex-table';

type MovementRecord = {
  id: string;
  fecha: string;
  tipo: 'Entrada' | 'Salida' | 'Merma' | 'Ajuste';
  insumo: string;
  almacen: string;
  cantidad: string;
  saldo: string;
  documento: string;
  responsable: string;
  motivo: string;
};

const ALL_MOVEMENTS: MovementRecord[] = [
  { id: 'm1', fecha: '2026-09-29T09:00:00', tipo: 'Salida', insumo: 'Harina de trigo', almacen: 'Almacén Seco de Abarrotes', cantidad: '-4', saldo: '42', documento: 'PROD-2308', responsable: 'Luis Ramírez', motivo: 'Consumo en producción del día' },
  { id: 'm2', fecha: '2026-09-28T10:00:00', tipo: 'Entrada', insumo: 'Harina de trigo', almacen: 'Almacén Seco de Abarrotes', cantidad: '10', saldo: '46', documento: 'OC-1098', responsable: 'Ana Morales', motivo: 'Compra de emergencia' },
  { id: 'm3', fecha: '2026-09-27T11:00:00', tipo: 'Salida', insumo: 'Aceite vegetal', almacen: 'Almacén Seco de Abarrotes', cantidad: '-6', saldo: '36', documento: 'PROD-2301', responsable: 'Luis Ramírez', motivo: 'Consumo en preparación de platos' },
  { id: 'm4', fecha: '2026-09-26T08:45:00', tipo: 'Merma', insumo: 'Harina de trigo', almacen: 'Almacén Seco de Abarrotes', cantidad: '-2', saldo: '42', documento: 'MERMA-025', responsable: 'Carlos Ruiz', motivo: 'Producto afectado por humedad' },
  { id: 'm5', fecha: '2026-09-25T11:30:00', tipo: 'Salida', insumo: 'Cajas para delivery', almacen: 'Almacén de Empaques y Delivery', cantidad: '-8', saldo: '332', documento: 'DESP-2299', responsable: 'Luis Ramírez', motivo: 'Despachos de pedidos del día' },
  { id: 'm6', fecha: '2026-09-24T10:00:00', tipo: 'Ajuste', insumo: 'Tomate fresco', almacen: 'Refrigerador de Frescos y Vegetales', cantidad: '1', saldo: '12', documento: 'AJ-0081', responsable: 'Carlos Ruiz', motivo: 'Ajuste por conteo físico' },
  { id: 'm7', fecha: '2026-09-23T09:30:00', tipo: 'Entrada', insumo: 'Filete de lenguado', almacen: 'Cámara Fría de Pescados y Mariscos', cantidad: '15', saldo: '24', documento: 'OC-1091', responsable: 'Ana Morales', motivo: 'Ingreso fresco de proveedor' },
  { id: 'm8', fecha: '2026-09-22T08:15:00', tipo: 'Entrada', insumo: 'Limón', almacen: 'Refrigerador de Frescos y Vegetales', cantidad: '20', saldo: '30', documento: 'OC-1085', responsable: 'Ana Morales', motivo: 'Reposición de productos frescos' },
  { id: 'm9', fecha: '2026-09-21T14:20:00', tipo: 'Salida', insumo: 'Cerveza', almacen: 'Cava y Depósito de Barra', cantidad: '-10', saldo: '96', documento: 'BARRA-2240', responsable: 'Luis Ramírez', motivo: 'Consumo registrado en barra' },
  { id: 'm10', fecha: '2026-09-20T11:00:00', tipo: 'Entrada', insumo: 'Cloro alimentario', almacen: 'Bodega de Limpieza y Químicos', cantidad: '5', saldo: '8', documento: 'OC-1040', responsable: 'Ana Morales', motivo: 'Reposición de productos de limpieza' },
  { id: 'm11', fecha: '2026-09-19T09:00:00', tipo: 'Entrada', insumo: 'Langostinos', almacen: 'Cámara Fría de Pescados y Mariscos', cantidad: '12', saldo: '16', documento: 'OC-1102', responsable: 'Ana Morales', motivo: 'Recepción de producto congelado' },
  { id: 'm12', fecha: '2026-09-18T12:30:00', tipo: 'Salida', insumo: 'Queso mozzarella', almacen: 'Refrigerador de Frescos y Vegetales', cantidad: '-2', saldo: '7', documento: 'PROD-2310', responsable: 'Luis Ramírez', motivo: 'Consumo en preparación de platos' },
  { id: 'm13', fecha: '2026-09-17T08:00:00', tipo: 'Entrada', insumo: 'Camote', almacen: 'Almacén Seco de Abarrotes', cantidad: '15', saldo: '28', documento: 'OC-1097', responsable: 'Ana Morales', motivo: 'Compra semanal de abarrotes' },
  { id: 'm14', fecha: '2026-09-16T15:00:00', tipo: 'Salida', insumo: 'Pisco', almacen: 'Cava y Depósito de Barra', cantidad: '-3', saldo: '12', documento: 'BARRA-2290', responsable: 'Luis Ramírez', motivo: 'Preparación de bebidas' },
  { id: 'm15', fecha: '2026-09-15T10:20:00', tipo: 'Entrada', insumo: 'Envases herméticos', almacen: 'Almacén de Empaques y Delivery', cantidad: '100', saldo: '240', documento: 'OC-1090', responsable: 'Ana Morales', motivo: 'Reposición de envases para pedidos' },
  { id: 'm16', fecha: '2026-09-14T09:10:00', tipo: 'Merma', insumo: 'Tomate fresco', almacen: 'Refrigerador de Frescos y Vegetales', cantidad: '-2', saldo: '11', documento: 'MERMA-027', responsable: 'Carlos Ruiz', motivo: 'Producto deteriorado durante almacenamiento' },
  { id: 'm17', fecha: '2026-09-13T11:45:00', tipo: 'Entrada', insumo: 'Cebolla roja', almacen: 'Refrigerador de Frescos y Vegetales', cantidad: '10', saldo: '18', documento: 'OC-1088', responsable: 'Ana Morales', motivo: 'Reposición de vegetales frescos' },
  { id: 'm18', fecha: '2026-09-12T13:00:00', tipo: 'Salida', insumo: 'Choclo', almacen: 'Almacén Seco de Abarrotes', cantidad: '-5', saldo: '40', documento: 'PROD-2281', responsable: 'Luis Ramírez', motivo: 'Consumo en preparación del día' },
  { id: 'm19', fecha: '2026-09-11T08:30:00', tipo: 'Entrada', insumo: 'Pechuga de pollo', almacen: 'Cámara Fría de Pescados y Mariscos', cantidad: '10', saldo: '25', documento: 'OC-1086', responsable: 'Ana Morales', motivo: 'Recepción de producto refrigerado' },
  { id: 'm20', fecha: '2026-09-10T10:00:00', tipo: 'Merma', insumo: 'Aceite vegetal', almacen: 'Almacén Seco de Abarrotes', cantidad: '-1', saldo: '18', documento: 'MERMA-026', responsable: 'Carlos Ruiz', motivo: 'Envase dañado durante manipulación' },
  { id: 'm21', fecha: '2026-09-09T14:00:00', tipo: 'Salida', insumo: 'Cloro alimentario', almacen: 'Bodega de Limpieza y Químicos', cantidad: '-2', saldo: '6', documento: 'LIMP-052', responsable: 'Carlos Ruiz', motivo: 'Desinfección de superficies de trabajo' },
  { id: 'm22', fecha: '2026-09-08T16:30:00', tipo: 'Entrada', insumo: 'Cajas para delivery', almacen: 'Almacén de Empaques y Delivery', cantidad: '50', saldo: '340', documento: 'OC-1080', responsable: 'Ana Morales', motivo: 'Compra de cajas para despacho' },
];

export function InventoryKardexPage() {
  const [selectedInsumoId, setSelectedInsumoId] = useState<string>('todos');
  const [selectedAlmacen, setSelectedAlmacen] = useState<string>('todos');
  const [movementType, setMovementType] = useState<'todos' | 'entrada' | 'salida' | 'merma' | 'ajuste'>('todos');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedMovementId, setSelectedMovementId] = useState<string | null>(null);

  const selectedInsumo = useMemo(
    () => INSUMOS_FIXTURE.find((ins) => ins.id === selectedInsumoId) ?? null,
    [selectedInsumoId],
  );

  const rawMovements = useMemo(() => {
    let list = ALL_MOVEMENTS;

    if (selectedInsumoId !== 'todos') {
      const insumoName = selectedInsumo?.nombre || '';
      list = list.filter((m) => m.insumo.toLowerCase() === insumoName.toLowerCase());
    }

    if (selectedAlmacen !== 'todos') {
      list = list.filter((m) => m.almacen.toLowerCase() === selectedAlmacen.toLowerCase());
    }

    if (startDate) {
      list = list.filter((m) => m.fecha.slice(0, 10) >= startDate);
    }

    if (endDate) {
      list = list.filter((m) => m.fecha.slice(0, 10) <= endDate);
    }

    return list;
  }, [selectedInsumoId, selectedAlmacen, selectedInsumo, startDate, endDate]);

  const movements = useMemo(() => {
    if (movementType === 'todos') return rawMovements;
    return rawMovements.filter((m) => m.tipo.toLowerCase() === movementType);
  }, [rawMovements, movementType]);

  const selectedMovement = useMemo(
    () => movements.find((m) => m.id === selectedMovementId) || movements[0] || null,
    [movements, selectedMovementId],
  );

  const getDetailBadgeStyle = (tipo: string) => {
    const t = (tipo || '').toLowerCase();
    if (t.includes('entrada')) return 'bg-emerald-100 text-emerald-800';
    if (t.includes('salida')) return 'bg-amber-100 text-amber-800';
    if (t.includes('merma')) return 'bg-rose-100 text-rose-800';
    if (t.includes('ajuste')) return 'bg-sky-100 text-sky-800';
    return 'bg-gray-100 text-gray-800';
  };

  const countInsumosConMovimiento = useMemo(() => {
    const uniqueInsumos = new Set(rawMovements.map((m) => m.insumo));
    return uniqueInsumos.size;
  }, [rawMovements]);

  const countEntradas = useMemo(() => 
    rawMovements.filter((m) => m.tipo.toLowerCase().includes('entrada')).length,
    [rawMovements]
  );
  
  const countSalidas = useMemo(() => 
    rawMovements.filter((m) => m.tipo.toLowerCase().includes('salida')).length,
    [rawMovements]
  );
  
  const countAjustes = useMemo(() => 
    rawMovements.filter((m) => m.tipo.toLowerCase().includes('ajuste')).length,
    [rawMovements]
  );
  
  const countMermas = useMemo(() => 
    rawMovements.filter((m) => m.tipo.toLowerCase().includes('merma')).length,
    [rawMovements]
  );

  return (
    <div className="p-8 space-y-6 bg-background min-h-screen text-foreground">
      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <span>INVENTARIO</span>
            <span>&bull;</span>
            <span className="font-semibold text-foreground">KARDEX</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Movimientos de almacén</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Trazabilidad de entradas, consumos, ajustes y mermas
          </p>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-3 py-1.5 rounded-full font-medium flex items-center gap-1.5 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Contexto: almacén
        </div>
      </div>

      {/* BLOQUE DE FILTROS Y TARJETAS */}
      <div className="bg-card border border-border rounded-xl p-4 shadow-2xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-muted-foreground tracking-wider">INSUMO</label>
            <select 
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs"
              value={selectedInsumoId}
              onChange={(e) => {
                setSelectedInsumoId(e.target.value);
                setSelectedMovementId(null);
              }}
            >
              <option value="todos">Todos los insumos</option>
              {INSUMOS_FIXTURE.map((ins) => (
                <option key={ins.id} value={ins.id}>{ins.nombre}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-muted-foreground tracking-wider">ALMACÉN</label>
            <select 
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs"
              value={selectedAlmacen}
              onChange={(e) => {
                setSelectedAlmacen(e.target.value);
                setSelectedMovementId(null);
              }}
            >
              <option value="todos">Todos los almacenes</option>
              {ALMACENES_MOCK.map((almacen) => (
                <option key={almacen.id} value={almacen.nombre}>{almacen.nombre}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-muted-foreground tracking-wider">TIPO DE MOVIMIENTO</label>
            <select 
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs"
              value={movementType}
              onChange={(e) => setMovementType(e.target.value as typeof movementType)}
            >
              <option value="todos">Todos los movimientos</option>
              <option value="entrada">Entradas</option>
              <option value="salida">Salidas</option>
              <option value="merma">Mermas</option>
              <option value="ajuste">Ajustes</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-muted-foreground tracking-wider">DESDE</label>
            <input 
              type="date" 
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-muted-foreground tracking-wider">HASTA</label>
            <input 
              type="date" 
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        {/* Tarjetas de Indicadores Dinámicas */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          <div className="bg-zinc-900 text-zinc-100 p-3 rounded-lg flex items-center justify-between shadow-2xs">
            <div>
              <span className="text-[10px] text-zinc-400 font-medium block uppercase">Insumos con movimientos</span>
              <span className="text-base font-bold">{countInsumosConMovimiento} Insumos</span>
            </div>
            <div className="w-2 h-2 rounded-full bg-zinc-500"></div>
          </div>

          <div className="bg-emerald-50/70 border border-emerald-200/60 p-3 rounded-lg flex items-center justify-between shadow-2xs">
            <div>
              <span className="text-[10px] text-emerald-700 font-medium block uppercase">Entradas</span>
              <span className="text-base font-bold text-emerald-900">{countEntradas}</span>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          </div>

          <div className="bg-amber-50/70 border border-amber-200/60 p-3 rounded-lg flex items-center justify-between shadow-2xs">
            <div>
              <span className="text-[10px] text-amber-700 font-medium block uppercase">Salidas</span>
              <span className="text-base font-bold text-amber-900">{countSalidas}</span>
            </div>
            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
          </div>

          <div className="bg-sky-50/70 border border-sky-200/60 p-3 rounded-lg flex items-center justify-between shadow-2xs">
            <div>
              <span className="text-[10px] text-sky-700 font-medium block uppercase">Ajustes</span>
              <span className="text-base font-bold text-sky-900">{countAjustes}</span>
            </div>
            <div className="w-2 h-2 rounded-full bg-sky-500"></div>
          </div>

          <div className="bg-rose-50/70 border border-rose-200/60 p-3 rounded-lg flex items-center justify-between shadow-2xs">
            <div>
              <span className="text-[10px] text-rose-700 font-medium block uppercase">Mermas</span>
              <span className="text-base font-bold text-rose-900">{countMermas}</span>
            </div>
            <div className="w-2 h-2 rounded-full bg-rose-500"></div>
          </div>
        </div>
      </div>

      {/* CONTENEDOR PRINCIPAL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-base font-bold text-foreground">Historial</h2>
              <p className="text-[11px] text-muted-foreground">
                {selectedAlmacen === 'todos' ? 'Todos los almacenes' : selectedAlmacen}
              </p>
            </div>
            <span className="text-xs text-muted-foreground font-medium">{movements.length} movimientos</span>
          </div>
          <KardexTable 
            movements={movements} 
            unidadMedida={selectedInsumo?.unidadMedida || 'kg'}
            onSelectMovement={(m) => setSelectedMovementId(m.id)}
            selectedMovementId={selectedMovement?.id}
          />
        </div>

        {/* Panel Lateral de Detalle */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center pb-3 border-b border-border mb-4">
              <h3 className="text-sm font-bold text-foreground">Detalle del movimiento</h3>
              {selectedMovement && (
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${getDetailBadgeStyle(selectedMovement.tipo)}`}>
                  {selectedMovement.tipo}
                </span>
              )}
            </div>

            {selectedMovement ? (
              <div className="space-y-4 text-xs">
                <div className="bg-zinc-900 text-zinc-100 p-4 rounded-xl flex items-center justify-between shadow-xs">
                  <div>
                    <span className="text-[10px] text-zinc-400 uppercase font-semibold block mb-1">VARIACIÓN DE STOCK</span>
                    <span className="text-lg font-bold">
                      {String(selectedMovement.cantidad).startsWith('-') ? selectedMovement.cantidad : `+${selectedMovement.cantidad}`}
                    </span>
                  </div>
                  <span className="text-zinc-500 text-lg">&rarr;</span>
                  <div className="text-right">
                    <span className="text-[10px] text-zinc-400 uppercase font-semibold block mb-1">NUEVO</span>
                    <span className="text-lg font-bold text-emerald-400">
                      {selectedMovement.saldo} {selectedInsumo?.unidadMedida || 'kg'}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 pt-2 text-xs">
                  <div>
                    <span className="text-muted-foreground block text-[10px] font-semibold uppercase">FECHA Y HORA</span>
                    <span className="font-medium text-foreground text-sm">
                      {selectedMovement.fecha ? new Date(selectedMovement.fecha).toLocaleString() : '-'}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px] font-semibold uppercase">INSUMO</span>
                    <span className="font-medium text-foreground text-sm">{selectedMovement.insumo}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px] font-semibold uppercase">ALMACÉN</span>
                    <span className="font-medium text-foreground text-sm">{selectedMovement.almacen}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px] font-semibold uppercase">CANTIDAD</span>
                    <span className="font-medium text-foreground text-sm">
                      {String(selectedMovement.cantidad).startsWith('-') ? selectedMovement.cantidad : `+${selectedMovement.cantidad}`} {selectedInsumo?.unidadMedida || 'kg'}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px] font-semibold uppercase">REGISTRADO POR</span>
                    <span className="font-medium text-foreground text-sm">{selectedMovement.responsable || 'Sistema'}</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground text-center py-12">Selecciona un movimiento para ver el detalle</p>
            )}
          </div>

          {selectedMovement && (
            <div className="mt-6 pt-4 border-t border-border">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold block mb-1.5">ORIGEN TRAZABLE</span>
              <div className="p-3 bg-muted/40 rounded-lg border border-border font-mono text-xs text-foreground mb-3">
                {selectedMovement.documento}
              </div>
              <span className="text-[10px] text-muted-foreground uppercase font-semibold block mb-1.5">MOTIVO</span>
              <div className="text-xs text-foreground bg-muted/20 p-2.5 rounded-lg border border-border">
                {selectedMovement.motivo}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
