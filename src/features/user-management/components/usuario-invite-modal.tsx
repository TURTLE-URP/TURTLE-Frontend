import { X } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import type { UserInviteFormValues } from '../logic/schema';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UserInviteFormValues) => void;
}

export function UsuarioInviteModal({ isOpen, onClose, onSubmit }: Props) {
  const [formData, setFormData] = useState({
    email: '',
    tipoUsuario: 'trabajador',
    firstName: '',
    lastName: '',
    role: 'mozo',
    activo: true,
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email,
      role: formData.role as UserInviteFormValues['role'],
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-20 grid place-items-center bg-[#173a36]/30 px-5"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-lg bg-white p-6 shadow-2xl rounded-lg">
        {/* Encabezado */}
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="font-serif text-2xl text-[#173a36]">Nuevo trabajador</h2>
          </div>
          <button onClick={onClose} type="button">
            <X size={20} className="text-[#91a19b]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 1) Cuenta Usuario (base) */}
          <div className="rounded-lg border border-[#e1e8e3] p-4 space-y-3 bg-[#fbfcfb]">
            <p className="text-xs font-semibold text-[#173a36]">1) Cuenta Usuario (base)</p>
            
            <label className="block text-xs font-medium text-[#526860]">
              Email
              <input
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1 h-9 w-full rounded-md border border-[#dfe8e2] bg-white px-3 text-sm outline-none focus:border-[#3b9a81]"
                placeholder="j.perez@gmail.com"
              />
            </label>
          </div>

          {/* 2) Perfil Trabajador — aquí vive el ROL */}
          <div className="rounded-lg border border-[#f3e9c6] bg-[#fdfbf2] p-4 space-y-3">
            <p className="text-xs font-semibold text-[#173a36]">
              2) Perfil Trabajador
            </p>

            {/* Campos Nombre y Apellido separados */}
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-xs font-medium text-[#526860]">
                Nombre
                <input
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="mt-1 h-9 w-full rounded-md border border-[#dfe8e2] bg-white px-3 text-sm outline-none focus:border-[#3b9a81]"
                  placeholder="Juan"
                />
              </label>

              <label className="block text-xs font-medium text-[#526860]">
                Apellido
                <input
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="mt-1 h-9 w-full rounded-md border border-[#dfe8e2] bg-white px-3 text-sm outline-none focus:border-[#3b9a81]"
                  placeholder="Pérez"
                />
              </label>
            </div>

            {/* Campo Rol a ancho completo */}
            <div>
              <label className="block text-xs font-medium text-[#526860]">
                Rol
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="mt-1 h-9 w-full rounded-md border border-[#dfe8e2] bg-white px-3 text-sm outline-none focus:border-[#3b9a81]"
                >
                  <option value="anfitrion">Anfitrión</option>
                  <option value="mozo">Mozo</option>
                  <option value="cocinero">Cocinero</option>
                  <option value="asistente_de_cocina">Asistente de cocina</option>
                  <option value="almacenero">Almacenero</option>
                  <option value="jefe">Jefe</option>
                  <option value="administrador">Administrador</option>
                </select>
              </label>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-2 pt-2">
            <Button type="submit" className="rounded-md bg-[#2d3748] hover:bg-[#1a202c] text-white">
              Guardar
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="rounded-md">
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}