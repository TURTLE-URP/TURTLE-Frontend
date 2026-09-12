import { PencilSimple, Prohibit, CheckCircle } from '@phosphor-icons/react';
import type { Insumo } from '../logic/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface Props {
  insumos: Insumo[];
  onInactivar: (id: string) => void;
  onActivar: (id: string) => void;
  onEditar: (insumo: Insumo) => void;
}

export function InsumosTable({ insumos, onInactivar, onActivar, onEditar }: Props) {  return (
    <div className="border border-border rounded-xl bg-card shadow-xs overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 text-xs text-muted-foreground uppercase tracking-wider">
            <TableHead>Insumo</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {insumos.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                No se encontraron insumos.
              </TableCell>
            </TableRow>
          ) : (
            insumos.map((item) => {
              const porcentaje = Math.min(
                100,
                Math.round((item.stockActual / (item.stockAbasto || 1)) * 100)
              );

              return (
                <TableRow key={item.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell>
                    <div className="font-semibold text-foreground text-sm">{item.nombre}</div>
                    <div className="text-xs text-muted-foreground font-mono">{item.codigo}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-normal text-xs bg-background">
                      {item.categoria}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 w-32">
                      <span className="text-xs font-bold text-foreground">
                        {item.stockActual} <span className="font-normal text-muted-foreground">{item.unidadMedida}</span>
                      </span>
                      <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-1.5 rounded-full ${
                            item.nivelStock === 'Critico'
                              ? 'bg-rose-500'
                              : item.nivelStock === 'Bajo'
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${porcentaje}%` }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        item.estado === 'Activo'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-zinc-100 text-zinc-600 border-zinc-200'
                      }`}
                    >
                      {item.estado}
                    </span>
                  </TableCell>
                  
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onEditar(item)}
                        className="p-1 text-gray-500 hover:text-emerald-600 transition-colors"
                        title="Editar Insumo"                      
                      >
                        <PencilSimple size={18} />
                      </button>
                      {item.estado === 'Activo' ? (
                      <button
                        type="button"
                        title="Inactivar Insumo"
                        onClick={() => onInactivar(item.id)}
                        className="p-1.5 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                      >
                        <Prohibit size={16} />
                      </button>
) : (
  <button
    type="button"
    title="Activar Insumo"
    onClick={() => onActivar(item.id)}
    className="p-1.5 text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
  >
    <CheckCircle size={16} />
  </button>
)}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}