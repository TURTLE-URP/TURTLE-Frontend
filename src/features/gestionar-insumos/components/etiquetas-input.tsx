import { useState } from 'react';
import { XIcon, PlusIcon } from '@phosphor-icons/react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Props {
  value: string[];
  onChange: (etiquetas: string[]) => void;
}

/** Input de etiquetas compartido por los modales de registrar y editar insumo. */
export function EtiquetasInput({ value, onChange }: Props) {
  const [input, setInput] = useState('');

  const handleAdd = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    const val = input.trim();
    if (val && !value.includes(val)) {
      onChange([...value, val]);
      setInput('');
    }
  };

  return (
    <div>
      <Label className="text-xs font-medium text-gray-700">
        Etiquetas <span className="text-red-500">(opcional)</span>
      </Label>
      <div className="mt-1 flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleAdd}
          placeholder="Escribir etiqueta y presionar Enter"
        />
        <Button type="button" variant="outline" onClick={handleAdd} className="px-3">
          <PlusIcon size={16} />
        </Button>
      </div>
      {value.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {value.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700 border border-emerald-200"
            >
              {tag}
              <button
                type="button"
                onClick={() => onChange(value.filter((t) => t !== tag))}
                className="hover:text-emerald-900"
              >
                <XIcon size={12} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}