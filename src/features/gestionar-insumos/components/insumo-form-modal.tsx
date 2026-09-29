import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { XIcon } from '@phosphor-icons/react';

import { insumoSchema } from '../logic/schema';
import type { InsumoFormValues } from '../logic/schema';
import { EtiquetasInput } from './etiquetas-input';
import { InsumoFields } from './insumo-fields';

import { Button } from '@/components/ui/button';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: InsumoFormValues) => void;
}

export function InsumoFormModal({ open, onOpenChange, onSubmit }: Props) {
  const [etiquetas, setEtiquetas] = useState<string[]>([]);

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
      unidadMedida: 'kg',
      diasVencimiento: '',
      etiquetas: [],
    },
  });

  if (!open) return null;

  const handleClose = () => {
    reset();
    setEtiquetas([]);
    onOpenChange(false);
  };

  const onFormSubmit = (data: InsumoFormValues) => {
    onSubmit({ ...data, etiquetas });
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl border border-gray-100">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
              NUEVO INSUMO
            </span>
            <h2 className="text-xl font-bold text-gray-800">Registrar Insumo</h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <XIcon size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="mt-4 space-y-4">
          <InsumoFields register={register} errors={errors} />
          <EtiquetasInput value={etiquetas} onChange={setEtiquetas} />

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
            >
              Registrar insumo
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}