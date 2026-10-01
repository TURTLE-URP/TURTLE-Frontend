import React, { useState } from 'react';

// Íconos SVG integrados para no depender de librerías externas
const IconMesa = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 10h16"/><path d="M4 14h16"/><path d="M6 18v-4"/><path d="M18 18v-4"/><path d="M6 6v4"/><path d="M18 6v4"/>
  </svg>
);

const IconMinus = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
);

const IconPlus = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
);

const IconCerrar = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);

const IconAlerta = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
);

interface ModalMesaProps {
  onClose?: () => void;
  onSave?: (data: any) => void;
}

export default function ModalMesa({ onClose, onSave }: ModalMesaProps) {
  // Estados del formulario
  const [codigo] = useState('M-13'); // Autogenerado, no editable
  const [numeroMesa, setNumeroMesa] = useState('13');
  const [piso, setPiso] = useState('piso_1');
  const [capacidad, setCapacidad] = useState(4);
  
  // Estado para el error (simulado)
  const [errorNumero, setErrorNumero] = useState<string | null>('El Nro 7 ya existe (M-07)');

  // Manejadores
  const handleIncremento = () => {
    if (capacidad < 12) setCapacidad(capacidad + 1);
  };

  const handleDecremento = () => {
    if (capacidad > 1) setCapacidad(capacidad - 1);
  };

  const handleGuardar = () => {
    // Aquí iría tu lógica de guardado
    if (onSave) onSave({ codigo, numeroMesa, piso, capacidad });
    console.log('Guardando...', { codigo, numeroMesa, piso, capacidad });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Encabezado */}
        <div className="flex items-start justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-700">
              <IconMesa />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                Mesa {codigo} 
                <span className="text-gray-300 font-normal">•</span> 
                <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">Borrador</span>
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">Configura los detalles de la mesa</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition p-1 rounded-lg hover:bg-gray-100">
            <IconCerrar />
          </button>
        </div>

        {/* Cuerpo del Formulario */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          
          {/* Campo: Código (Auto, no editable) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Código (auto, único, no editable)
            </label>
            <input
              type="text"
              value={codigo}
              disabled
              className="w-full bg-gray-50 border border-gray-200 text-gray-500 rounded-xl px-4 py-2.5 cursor-not-allowed focus:outline-none"
            />
          </div>

          {/* Campo: Número de Mesa */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Número de mesa (único 1-99) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={numeroMesa}
              onChange={(e) => {
                setNumeroMesa(e.target.value);
                setErrorNumero(null); // Limpiar error al escribir
              }}
              className={`w-full border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 transition-all ${
                errorNumero 
                  ? 'border-red-300 focus:ring-red-200 bg-red-50/50' 
                  : 'border-gray-300 focus:ring-gray-200 focus:border-gray-400'
              }`}
            />
            {/* Mensaje de Error Mejorado */}
            {errorNumero && (
              <div className="flex items-center gap-1.5 mt-2 text-red-600 text-sm font-medium animate-in slide-in-from-top-1">
                <IconAlerta />
                <span>{errorNumero}</span>
              </div>
            )}
          </div>

          {/* Campo: Piso (Radio Buttons Mejorados) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Piso <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-4">
              <label className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border-2 cursor-pointer transition-all ${
                piso === 'piso_1' 
                  ? 'border-gray-800 bg-gray-50 text-gray-900' 
                  : 'border-gray-200 text-gray-500 hover:border-gray-300'
              }`}>
                <input
                  type="radio"
                  name="piso"
                  value="piso_1"
                  checked={piso === 'piso_1'}
                  onChange={(e) => setPiso(e.target.value)}
                  className="sr-only" // Ocultamos el radio nativo
                />
                {/* Radio personalizado */}
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  piso === 'piso_1' ? 'border-gray-800' : 'border-gray-300'
                }`}>
                  {piso === 'piso_1' && <div className="w-2 h-2 rounded-full bg-gray-800"></div>}
                </div>
                <span className="font-medium text-sm">Piso 1</span>
              </label>

              <label className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border-2 cursor-pointer transition-all ${
                piso === 'piso_2' 
                  ? 'border-gray-800 bg-gray-50 text-gray-900' 
                  : 'border-gray-200 text-gray-500 hover:border-gray-300'
              }`}>
                <input
                  type="radio"
                  name="piso"
                  value="piso_2"
                  checked={piso === 'piso_2'}
                  onChange={(e) => setPiso(e.target.value)}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  piso === 'piso_2' ? 'border-gray-800' : 'border-gray-300'
                }`}>
                  {piso === 'piso_2' && <div className="w-2 h-2 rounded-full bg-gray-800"></div>}
                </div>
                <span className="font-medium text-sm">Piso 2</span>
              </label>
            </div>
          </div>

          {/* Campo: Capacidad (Stepper Mejorado) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Capacidad (1-12) <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={handleDecremento}
                disabled={capacidad <= 1}
                className="w-11 h-11 flex items-center justify-center border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 hover:border-gray-300 active:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <IconMinus />
              </button>
              
              <div className="w-20 h-11 flex items-center justify-center border border-gray-200 rounded-xl text-gray-800 font-bold text-lg bg-gray-50/50">
                {capacidad}
              </div>
              
              <button
                onClick={handleIncremento}
                disabled={capacidad >= 12}
                className="w-11 h-11 flex items-center justify-center border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 hover:border-gray-300 active:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <IconPlus />
              </button>
            </div>
          </div>

        </div>

        {/* Footer con Botones */}
        <div className="flex gap-3 p-6 border-t border-gray-100 bg-gray-50/50">
          <button
            onClick={handleGuardar}
            className="flex-1 bg-gray-900 hover:bg-black text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-gray-200 active:scale-[0.98]"
          >
            Guardar
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-xl border border-gray-200 transition-all active:scale-[0.98]"
          >
            Cancelar
          </button>
        </div>

      </div>
    </div>
  );
}