import { X } from '@phosphor-icons/react';
import { Button } from '@/shared/components/ui/button';
import { useState, useEffect } from 'react';

export interface UpdateWorkerData {
  name?: string;
  lastName?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateWorkerData) => void;
  initialData?: {
    name?: string;
    lastName?: string;
  };
}

export function UsuarioEditModal({ isOpen, onClose, onSubmit, initialData }: Props) {
  const [formData, setFormData] = useState<UpdateWorkerData>({
    name: '',
    lastName: '',
  });

  // Cargar datos actuales cuando se abre el modal
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        lastName: initialData.lastName || '',
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Aplicar .trim() y enviar solo si contienen texto
    const payload: UpdateWorkerData = {};
    if (formData.name?.trim()) payload.name = formData.name.trim();
    if (formData.lastName?.trim()) payload.lastName = formData.lastName.trim();

    onSubmit(payload);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-20 grid place-items-center bg-[#173a36]/30 px-5"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md bg-white p-6 shadow-2xl rounded-lg">
        {/* Encabezado */}
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="font-serif text-xl text-[#173a36]">Editar trabajador</h2>
            <p className="text-xs text-[#81918b]">Actualiza la información del perfil</p>
          </div>
          <button onClick={onClose} type="button">
            <X size={20} className="text-[#91a19b]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="rounded-lg border border-[#e1e8e3] bg-[#fbfcfb] p-4 space-y-3">
            <p className="text-xs font-semibold text-[#173a36]">Datos personales</p>

            <label className="block text-xs font-medium text-[#526860]">
              Nombre(s)
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 h-9 w-full rounded-md border border-[#dfe8e2] bg-white px-3 text-sm outline-none focus:border-[#3b9a81]"
                placeholder="Ej. Miguel Ohara"
              />
            </label>

            <label className="block text-xs font-medium text-[#526860]">
              Apellido(s)
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="mt-1 h-9 w-full rounded-md border border-[#dfe8e2] bg-white px-3 text-sm outline-none focus:border-[#3b9a81]"
                placeholder="Ej. De La Puerta"
              />
            </label>
          </div>

          {/* Botones */}
          <div className="flex gap-2 pt-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose} className="rounded-md">
              Cancelar
            </Button>
            <Button type="submit" className="rounded-md bg-[#2d3748] hover:bg-[#1a202c] text-white">
              Guardar cambios
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}