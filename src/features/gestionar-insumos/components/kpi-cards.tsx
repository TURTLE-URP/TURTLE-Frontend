import { Package, CheckCircle, Warning, WarningCircle } from '@phosphor-icons/react';
import type { KpiInsumos } from '../logic/types';

interface Props {
  kpis: KpiInsumos;
}

export function KpiCards({ kpis }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="p-4 rounded-xl border border-border bg-card shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground">Total Insumos</p>
          <p className="text-2xl font-bold text-foreground mt-1">{kpis.total}</p>
          <span className="text-[11px] text-muted-foreground">registrados</span>
        </div>
        <div className="p-2.5 rounded-lg bg-muted text-foreground">
          <Package size={22} />
        </div>
      </div>

      <div className="p-4 rounded-xl border border-border bg-card shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground">Activos</p>
          <p className="text-2xl font-bold text-foreground mt-1">{kpis.activos}</p>
          <span className="text-[11px] text-emerald-600 font-medium">disponibles</span>
        </div>
        <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600">
          <CheckCircle size={22} />
        </div>
      </div>

      <div className="p-4 rounded-xl border border-border bg-card shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground">Stock Bajo</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">{kpis.stockBajo}</p>
          <span className="text-[11px] text-amber-600 font-medium">alertas activas</span>
        </div>
        <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600">
          <Warning size={22} />
        </div>
      </div>

      <div className="p-4 rounded-xl border border-border bg-card shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground">Crítico / Sin Stock</p>
          <p className="text-2xl font-bold text-rose-600 mt-1">{kpis.criticos}</p>
          <span className="text-[11px] text-rose-600 font-medium">requieren acción</span>
        </div>
        <div className="p-2.5 rounded-lg bg-rose-50 text-rose-600">
          <WarningCircle size={22} />
        </div>
      </div>
    </div>
  );
}