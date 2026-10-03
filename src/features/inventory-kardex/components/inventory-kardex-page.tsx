import { useMemo, useState } from 'react';
import { useKardex } from '../logic/use-kardex';
import { INSUMOS_FIXTURE } from '../fixtures/insumos.fixtures';
import { KARDEX_MOVEMENTS_FIXTURE } from '../fixtures/movimientos.fixtures';
import { KardexTable, type KardexMovement } from './kardex-table';

type MovementTypeFilter = 'todos' | 'entrada' | 'salida' | 'ajuste' | 'merma';

function normalizeMovement(value: unknown, index: number): KardexMovement | null {
  if (typeof value !== 'object' || value === null) return null;

  const movement = value as Record<string, unknown>;
  const type = typeof movement.tipo === 'string' ? movement.tipo.toLowerCase() : '';
  const typeLabel = type.includes('entrada')
    ? 'Entrada'
    : type.includes('salida')
      ? 'Salida'
      : type.includes('merma')
        ? 'Merma'
        : type.includes('ajuste')
          ? 'Ajuste'
          : 'Movimiento';
  const insumo = INSUMOS_FIXTURE.find((item) => item.id === movement.insumoId);
  const rawQuantity = Number(movement.cantidad ?? 0);
  const quantity =
    typeLabel === 'Salida' || typeLabel === 'Merma'
      ? -Math.abs(rawQuantity)
      : Math.abs(rawQuantity);
  const date = typeof movement.fecha === 'string' ? movement.fecha : '';
  const document =
    typeof movement.documento === 'string' ? movement.documento : '';
  const id =
    typeof movement.id === 'string' || typeof movement.id === 'number'
      ? String(movement.id)
      : `${date}-${document}-${index}`;
  const rawBalance = movement.saldo ?? movement.saldoResultante;
  const balance =
    typeof rawBalance === 'number' || typeof rawBalance === 'string'
      ? rawBalance
      : '-';

  return {
    id,
    fecha: date,
    tipo: typeLabel,
    insumo:
      typeof movement.insumo === 'string'
        ? movement.insumo
        : insumo?.nombre ?? 'Insumo desconocido',
    unidadMedida:
      typeof movement.unidadMedida === 'string'
        ? movement.unidadMedida
        : insumo?.unidadMedida ?? 'kg',
    almacen:
      typeof movement.almacen === 'string' ? movement.almacen : 'Cocina Central',
    cantidad: Number.isFinite(quantity) ? quantity : String(movement.cantidad ?? '-'),
    saldo: balance,
    documento: document,
    responsable:
      typeof movement.responsable === 'string' ? movement.responsable : 'Sistema',
    motivo: typeof movement.motivo === 'string' ? movement.motivo : '',
  };
}

export function InventoryKardexPage() {
  const { data: apiMovements = [] } = useKardex();
  const [selectedInsumoId, setSelectedInsumoId] = useState<string>('todos');
  const [movementType, setMovementType] = useState<MovementTypeFilter>('todos');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedMovementId, setSelectedMovementId] = useState<string | null>(null);

  const selectedInsumo = useMemo(
    () => INSUMOS_FIXTURE.find((ins) => ins.id === selectedInsumoId) ?? null,
    [selectedInsumoId],
  );

  const allMovements = useMemo(() => {
    const source = Array.isArray(apiMovements) && apiMovements.length > 0
      ? apiMovements
      : KARDEX_MOVEMENTS_FIXTURE;

    return source
      .map((movement: unknown, index: number) => normalizeMovement(movement, index))
      .filter((movement): movement is KardexMovement => movement !== null)
      .sort((a, b) => b.fecha.localeCompare(a.fecha));
  }, [apiMovements]);

  const movements = useMemo(
    () =>
      allMovements.filter((movement) => {
        const matchesInsumo =
          selectedInsumoId === 'todos' ||
          movement.insumo === selectedInsumo?.nombre;
        const matchesType =
          movementType === 'todos' ||
          movement.tipo.toLowerCase() === movementType;
        const movementDate = movement.fecha.slice(0, 10);
        const matchesStartDate = !startDate || movementDate >= startDate;
        const matchesEndDate = !endDate || movementDate <= endDate;

        return (
          matchesInsumo &&
          matchesType &&
          matchesStartDate &&
          matchesEndDate
        );
      }),
    [allMovements, selectedInsumoId, selectedInsumo, movementType, startDate, endDate],
  );

  const selectedMovement = useMemo(
    () =>
      movements.find((movement) => movement.id === selectedMovementId) ??
      movements[0] ??
      null,
    [movements, selectedMovementId],
  );
  const selectedUnit =
    selectedMovement?.unidadMedida ?? selectedInsumo?.unidadMedida ?? 'kg';
  const previousBalance = selectedMovement
    ? Number(selectedMovement.saldo) - Number(selectedMovement.cantidad)
    : Number.NaN;

  const getDetailBadgeStyle = (tipo: string) => {
    const t = (tipo || '').toLowerCase();
    if (t.includes('entrada')) return 'bg-emerald-100 text-emerald-800';
    if (t.includes('salida')) return 'bg-amber-100 text-amber-800';
    if (t.includes('merma')) return 'bg-rose-100 text-rose-800';
    if (t.includes('ajuste')) return 'bg-sky-100 text-sky-800';
    return 'bg-gray-100 text-gray-800';
  };

  const countInsumosConMovimiento = new Set(
    movements.map((movement) => movement.insumo),
  ).size;
  const countEntradas = movements.filter((movement) => movement.tipo === 'Entrada').length;
  const countSalidas = movements.filter((movement) => movement.tipo === 'Salida').length;
  const countAjustes = movements.filter((movement) => movement.tipo === 'Ajuste').length;
  const countMermas = movements.filter((movement) => movement.tipo === 'Merma').length;

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
            <select className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs" defaultValue="central">
              <option value="central">Cocina Central</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-muted-foreground tracking-wider">TIPO DE MOVIMIENTO</label>
            <select
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs"
              value={movementType}
              onChange={(e) => setMovementType(e.target.value as MovementTypeFilter)}
            >
              <option value="todos">Todos los movimientos</option>
              <option value="entrada">Entradas</option>
              <option value="salida">Salidas</option>
              <option value="ajuste">Ajustes</option>
              <option value="merma">Mermas</option>
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

        {/* Tarjetas de Indicadores */}
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
                {selectedInsumoId === 'todos' ? 'Todos los insumos - Cocina Central' : `${selectedInsumo?.nombre} - Cocina Central`}
              </p>
            </div>
            <span className="text-xs text-muted-foreground font-medium">{movements.length} movimientos</span>
          </div>
          <KardexTable
            movements={movements}
            unidadMedida={selectedInsumo?.unidadMedida || 'kg'}
            onSelectMovement={(movement) => setSelectedMovementId(movement.id)}
            selectedMovementId={selectedMovement?.id}
            paginationKey={`${selectedInsumoId}:${movementType}:${startDate}:${endDate}`}
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
                    <span className="text-[10px] text-zinc-400 uppercase font-semibold block mb-1">ANTERIOR</span>
                    <span className="text-lg font-bold">
                      {Number.isFinite(previousBalance) ? previousBalance : '-'} {selectedUnit}
                    </span>
                  </div>
                  <span className="text-zinc-500 text-lg">&rarr;</span>
                  <div className="text-right">
                    <span className="text-[10px] text-zinc-400 uppercase font-semibold block mb-1">NUEVO</span>
                    <span className="text-lg font-bold text-emerald-400">
                      {selectedMovement.saldo} {selectedUnit}
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
                      {String(selectedMovement.cantidad).startsWith('-') ? selectedMovement.cantidad : `+${selectedMovement.cantidad}`} {selectedUnit}
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