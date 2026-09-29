import type { FieldErrors, UseFormRegister } from 'react-hook-form';

import type { InsumoFormValues } from '../logic/schema';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: FieldErrors<any>;
}

/** Campos comunes (sin etiquetas) de los modales de registrar y editar insumo. */
export function InsumoFields({ register, errors }: Props) {
  const err = (name: keyof InsumoFormValues) => errors[name]?.message as string | undefined;

  return (
    <>
      <div>
        <Label className="text-xs font-medium text-gray-700">Nombre del insumo *</Label>
        <Input {...register('nombre')} placeholder="Ej. Filete de Lenguado" className="mt-1" />
        {err('nombre') && <p className="text-[11px] text-red-500 mt-1">{err('nombre')}</p>}
      </div>

      <div>
        <Label className="text-xs font-medium text-gray-700">
          Descripción <span className="text-red-500">(opcional)</span>
        </Label>
        <Input
          {...register('descripcion')}
          placeholder="Descripción breve del insumo..."
          className="mt-1"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-xs font-medium text-gray-700">Unidad de medida *</Label>
          <select
            {...register('unidadMedida')}
            className="mt-1 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="kg">kg</option>
            <option value="g">g</option>
            <option value="caja">caja</option>
            <option value="unidad">unidad</option>
            <option value="litro">litro</option>
          </select>
        </div>

        <div>
          <Label className="text-xs font-medium text-gray-700">
            Días para vencimiento <span className="text-red-500">(opcional)</span>
          </Label>
          <Input
            type="number"
            min={1}
            step={1}
            {...register('diasVencimiento')}
            className="mt-1"
          />
          {err('diasVencimiento') && (
            <p className="text-[11px] text-red-500 mt-1">{err('diasVencimiento')}</p>
          )}
        </div>
      </div>
    </>
  );
}