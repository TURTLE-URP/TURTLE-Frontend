import { Check, Copy, Eye, EyeSlash, Key } from '@phosphor-icons/react';
import { Button } from '@/shared/components/ui/button';
import { useState } from 'react';

export interface CredencialesGeneradas {
  email: string;
  password: string;
}

interface Props {
  isOpen: boolean;
  data: CredencialesGeneradas | null;
  onClose: () => void;
}

/**
 * El backend (users.service.ts) genera la contraseña con crypto.randomBytes
 * y solo la devuelve en texto plano en la respuesta de POST /workers. No hay
 * integración de correo todavía (pendiente en el backend), así que este es
 * el único momento en que el admin puede verla — de ahí que el modal no se
 * cierre solo ni se pueda "recuperar" después.
 */
export function UsuarioCredentialsModal({ isOpen, data, onClose }: Props) {
  const [copiado, setCopiado] = useState(false);
  const [mostrarPassword, setMostrarPassword] = useState(false);

  if (!isOpen || !data) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(data.password);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      // Si el navegador bloquea el portapapeles (permisos, http sin TLS,
      // etc.), el admin igual puede seleccionar y copiar el texto a mano.
    }
  };

  return (
    <div className="fixed inset-0 z-30 grid place-items-center bg-[#173a36]/40 px-5">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-full bg-[#e2f5ee] text-[#19755e]">
            <Key size={20} />
          </div>
          <div>
            <h2 className="font-serif text-xl text-[#173a36]">Trabajador registrado</h2>
            
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <div>
            <p className="text-xs font-medium text-[#526860]">Correo</p>
            <p className="mt-1 rounded-md border border-[#dfe8e2] bg-[#fbfcfb] px-3 py-2 text-sm text-[#173a36]">
              {data.email}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium text-[#526860]">Contraseña generada</p>
            <div className="mt-1 flex items-center gap-2">
              <input
                readOnly
                type={mostrarPassword ? 'text' : 'password'}
                value={data.password}
                className="flex-1 rounded-md border border-[#dfe8e2] bg-[#fbfcfb] px-3 py-2 text-sm font-mono text-[#173a36] outline-none"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => setMostrarPassword((prev) => !prev)}
                aria-label={mostrarPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                className="h-9 shrink-0 rounded-md border-[#bfe0f5] px-3 text-[#0284c7] hover:bg-[#e0f2fe] hover:text-[#0284c7]"
              >
                {mostrarPassword ? <EyeSlash size={16} /> : <Eye size={16} />}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCopy}
                className="h-9 shrink-0 rounded-md px-3"
              >
                {copiado ? <Check size={16} className="text-[#19755e]" /> : <Copy size={16} />}
              </Button>
            </div>
            {copiado && <p className="mt-1 text-[11px] text-[#19755e]">Copiado al portapapeles</p>}
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <Button
            type="button"
            onClick={() => {
              setMostrarPassword(false);
              onClose();
            }}
            className="rounded-md bg-[#2d3748] text-white hover:bg-[#1a202c]"
          >
            Entendido, cerrar
          </Button>
        </div>
      </div>
    </div>
  );
}
