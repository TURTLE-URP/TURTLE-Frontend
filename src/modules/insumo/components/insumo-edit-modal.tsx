import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { XIcon } from '@phosphor-icons/react';

import { insumoSchema } from '../schemas/insumo.schema';
import type { InsumoFormValues } from '../schemas/insumo.schema';
import type { Insumo } from '../interfaces/insumo.types';

import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  insumo: Insumo | null;
  onSubmit: (data: InsumoFormValues) => void;
  isPending?: boolean;
}

export function InsumoEditModal({
  open,
  onOpenChange,
  insumo,
  onSubmit,
  isPending,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(insumoSchema),
    defaultValues: {
      nombre: '',
      descripcion: '',
      id_unidad_base: 1,
    },
  });

  useEffect(() => {
    if (insumo && open) {
      reset({
        nombre: insumo.nombre,
        descripcion: insumo.descripcion ?? '',
        id_unidad_base: insumo.id_unidad_base,
      });
    }
  }, [insumo, open, reset]);

  if (!open || !insumo) return null;

  const onFormSubmit = (data: InsumoFormValues) => {
    onSubmit(data);
    onOpenChange(false);
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl border border-gray-100">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
              EDITAR INSUMO
            </span>
            <h2 className="text-xl font-bold text-gray-800">{insumo.nombre}</h2>
          </div>
          <button
            onClick={handleClose}
            className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <XIcon size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="mt-4 space-y-4">
          <div>
            <Label className="text-xs font-medium text-gray-700">
              Nombre del insumo *
            </Label>
            <Input
              {...register('nombre')}
              placeholder="Ej. Arroz"
              className="mt-1"
            />
            {errors.nombre && (
              <p className="text-[11px] text-red-500 mt-1">
                {errors.nombre.message}
              </p>
            )}
          </div>

          <div>
            <Label className="text-xs font-medium text-gray-700">
              Descripción
            </Label>
            <Input
              {...register('descripcion')}
              placeholder="Descripción breve del insumo..."
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-xs font-medium text-gray-700">
              ID unidad base *
            </Label>
            <Input
              type="number"
              {...register('id_unidad_base')}
              className="mt-1"
            />
            {errors.id_unidad_base && (
              <p className="text-[11px] text-red-500 mt-1">
                {errors.id_unidad_base.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
            >
              {isPending ? 'Guardando...' : 'Guardar cambios'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
