import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Plus, CalendarBlank } from '@phosphor-icons/react';

import { insumoSchema } from '../logic/schema';
import type { InsumoFormValues } from '../logic/schema';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: InsumoFormValues) => void;
}

export function InsumoFormModal({ open, onOpenChange, onSubmit }: Props) {
  const [etiquetas, setEtiquetas] = useState<string[]>([]);
  const [etiquetaInput, setEtiquetaInput] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(insumoSchema),
    defaultValues: {
      nombre: '',
      categoria: 'Pescados',
      descripcion: '',
      stockActual: 0,
      stockMinimo: 0,
      stockAbasto: 0,
      unidadMedida: 'kg',
      fechaVencimiento: '',
      etiquetas: [],
    },
  });

  if (!open) return null;

  const handleAddEtiqueta = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    const val = etiquetaInput.trim();
    if (val && !etiquetas.includes(val)) {
      const nuevasEtiquetas = [...etiquetas, val];
      setEtiquetas(nuevasEtiquetas);
      setEtiquetaInput('');
    }
  };

  const handleRemoveEtiqueta = (tag: string) => {
    setEtiquetas(etiquetas.filter((t) => t !== tag));
  };

  const onFormSubmit = (data: InsumoFormValues) => {
    onSubmit({ ...data, etiquetas });
    reset();
    setEtiquetas([]);
    onOpenChange(false);
  };

  const handleClose = () => {
    reset();
    setEtiquetas([]);
    onOpenChange(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
              NUEVO INSUMO
            </span>
            <h2 className="text-xl font-bold text-gray-800">Registrar Insumo</h2>
          </div>
          <button
            onClick={handleClose}
            className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onFormSubmit)} className="mt-4 space-y-4">
          {/* Nombre y Categoría */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs font-medium text-gray-700">
                Nombre del insumo *
              </Label>
              <Input
                {...register('nombre')}
                placeholder="Ej. Filete de Lenguado"
                className="mt-1"
              />
              {errors.nombre && (
                <p className="text-[11px] text-red-500 mt-1">{errors.nombre.message}</p>
              )}
            </div>

            <div>
              <Label className="text-xs font-medium text-gray-700">Categoría *</Label>
              <select
                {...register('categoria')}
                className="mt-1 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="Mariscos">Mariscos</option>
                <option value="Pescados">Pescados</option>
                <option value="Verduras">Verduras</option>
                <option value="Condimentos">Condimentos</option>
                <option value="Bebidas">Bebidas</option>
                <option value="Envases">Envases</option>
                <option value="Abarrotes">Abarrotes</option>
              </select>
            </div>
          </div>

          {/* Descripción */}
          <div>
            <Label className="text-xs font-medium text-gray-700">Descripción</Label>
            <Input
              {...register('descripcion')}
              placeholder="Descripción breve del insumo..."
              className="mt-1"
            />
          </div>

          {/* Stocks */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label className="text-xs font-medium text-gray-700">Stock actual *</Label>
              <Input
                type="number"
                {...register('stockActual')}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs font-medium text-gray-700">Stock mínimo *</Label>
              <Input
                type="number"
                {...register('stockMinimo')}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs font-medium text-gray-700">Stock de abasto *</Label>
              <Input
                type="number"
                {...register('stockAbasto')}
                className="mt-1"
              />
            </div>
          </div>

          {/* Unidad, Proveedor, Fecha */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label className="text-xs font-medium text-gray-700">
                Unidad de medida *
              </Label>
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
                Fecha de vencimiento
              </Label>
              <div className="relative mt-1">
                <Input
                  type="date"
                  {...register('fechaVencimiento')}
                  className="pr-8"
                />
                <CalendarBlank
                  size={16}
                  className="absolute right-2.5 top-2.5 text-gray-400 pointer-events-none"
                />
              </div>
            </div>
          </div>

          {/* Etiquetas */}
          <div>
            <Label className="text-xs font-medium text-gray-700">Etiquetas</Label>
            <div className="mt-1 flex gap-2">
              <Input
                value={etiquetaInput}
                onChange={(e) => setEtiquetaInput(e.target.value)}
                onKeyDown={handleAddEtiqueta}
                placeholder="Escribir etiqueta y presionar Enter"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddEtiqueta}
                className="px-3"
              >
                <Plus size={16} />
              </Button>
            </div>
            {etiquetas.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {etiquetas.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700 border border-emerald-200"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveEtiqueta(tag)}
                      className="hover:text-emerald-900"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Footer Buttons */}
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