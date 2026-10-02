// import { useEffect, useMemo, useRef, useState } from 'react';
// import { XIcon, PlusIcon, TagIcon } from '@phosphor-icons/react';

// // import { buscarExacta, normalizar, sugerirEtiquetas } from '../logic/etiquetas';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';

// interface Props {
//   value: string[];
//   onChange: (etiquetas: string[]) => void;
//   /** Lista de etiquetas ya existentes, usada para sugerir mientras se escribe. */
//   etiquetasDisponibles?: string[];
//   /** Se invoca cuando el usuario agrega una etiqueta que no estaba en la lista. */
//   onCrearEtiqueta?: (etiqueta: string) => void;
// }

// type Opcion = { tipo: 'sugerencia' | 'nueva'; etiqueta: string };

// /** Input de etiquetas compartido por los modales de registrar y editar insumo. */
// export function EtiquetasInput({
//   value,
//   onChange,
//   etiquetasDisponibles = [],
//   onCrearEtiqueta,
// }: Props) {
//   const [input, setInput] = useState('');
//   const [abierto, setAbierto] = useState(false);
//   const [activa, setActiva] = useState(0);
//   const contenedorRef = useRef<HTMLDivElement>(null);

//   const texto = input.trim();

//   const opciones = useMemo<Opcion[]>(() => {
//     const lista: Opcion[] = sugerirEtiquetas(texto, etiquetasDisponibles, value).map((etiqueta) => ({
//       tipo: 'sugerencia',
//       etiqueta,
//     }));
//     const yaElegida = value.some((t) => normalizar(t) === normalizar(texto));
//     const existe = buscarExacta(texto, etiquetasDisponibles);
//     // Si lo escrito no existe en la lista, se ofrece agregarlo como etiqueta nueva.
//     if (texto && !existe && !yaElegida) lista.push({ tipo: 'nueva', etiqueta: texto });
//     return lista;
//   }, [texto, etiquetasDisponibles, value]);

//   // Cierra el desplegable al hacer clic fuera del componente
//   useEffect(() => {
//     const handler = (e: MouseEvent) => {
//       if (!contenedorRef.current?.contains(e.target as Node)) setAbierto(false);
//     };
//     document.addEventListener('mousedown', handler);
//     return () => document.removeEventListener('mousedown', handler);
//   }, []);

//   const seleccionar = (opcion: Opcion) => {
//     const { etiqueta, tipo } = opcion;
//     if (!value.some((t) => normalizar(t) === normalizar(etiqueta))) {
//       onChange([...value, etiqueta]);
//       if (tipo === 'nueva') onCrearEtiqueta?.(etiqueta);
//     }
//     setInput('');
//     setActiva(0);
//     setAbierto(false);
//   };

//   // Enter o botón "+": toma la opción resaltada (o la única coincidencia exacta)
//   const confirmar = () => {
//     if (!texto) return;
//     const exacta = buscarExacta(texto, etiquetasDisponibles);
//     if (exacta) return seleccionar({ tipo: 'sugerencia', etiqueta: exacta });
//     const opcion = opciones[activa] ?? opciones[0];
//     if (opcion) seleccionar(opcion);
//   };

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === 'ArrowDown') {
//       e.preventDefault();
//       setAbierto(true);
//       setActiva((i) => (opciones.length ? (i + 1) % opciones.length : 0));
//     } else if (e.key === 'ArrowUp') {
//       e.preventDefault();
//       setActiva((i) => (opciones.length ? (i - 1 + opciones.length) % opciones.length : 0));
//     } else if (e.key === 'Enter') {
//       e.preventDefault(); // evita enviar el formulario
//       if (abierto && opciones[activa]) seleccionar(opciones[activa]);
//       else confirmar();
//     } else if (e.key === 'Escape' && abierto) {
//       e.stopPropagation();
//       setAbierto(false);
//     }
//   };

//   const mostrarLista = abierto && opciones.length > 0;

//   return (
//     <div>
//       <Label className="text-xs font-medium text-gray-700">
//         Etiquetas <span className="text-red-500">(opcional)</span>
//       </Label>
//       <div className="mt-1 flex gap-2">
//         <div ref={contenedorRef} className="relative flex-1">
//           <Input
//             value={input}
//             onChange={(e) => {
//               setInput(e.target.value);
//               setActiva(0);
//               setAbierto(true);
//             }}
//             onFocus={() => setAbierto(true)}
//             onKeyDown={handleKeyDown}
//             placeholder="Escribir etiqueta y presionar Enter"
//             role="combobox"
//             aria-expanded={mostrarLista}
//             aria-autocomplete="list"
//             aria-controls="etiquetas-opciones"
//             autoComplete="off"
//           />

//           {mostrarLista && (
//             <ul
//               id="etiquetas-opciones"
//               role="listbox"
//               className="absolute left-0 right-0 top-full z-10 mt-1 max-h-56 overflow-y-auto rounded-md border border-gray-200 bg-white py-1 shadow-lg"
//             >
//               {opciones.map((op, i) => (
//                 <li
//                   key={`${op.tipo}-${op.etiqueta}`}
//                   role="option"
//                   aria-selected={i === activa}
//                   // mousedown (y no click) para no perder el foco del input antes de seleccionar
//                   onMouseDown={(e) => {
//                     e.preventDefault();
//                     seleccionar(op);
//                   }}
//                   onMouseEnter={() => setActiva(i)}
//                   className={`flex cursor-pointer items-center gap-2 px-3 py-2 text-sm ${
//                     i === activa ? 'bg-emerald-50 text-emerald-800' : 'text-gray-700'
//                   } ${op.tipo === 'nueva' ? 'border-t border-gray-100 font-medium' : ''}`}
//                 >
//                   {op.tipo === 'nueva' ? (
//                     <>
//                       <PlusIcon size={14} className="shrink-0 text-emerald-600" />
//                       <span className="truncate">
//                         Agregar “{op.etiqueta}” a la lista de etiquetas
//                       </span>
//                     </>
//                   ) : (
//                     <>
//                       <TagIcon size={14} className="shrink-0 text-gray-400" />
//                       <span className="truncate">{op.etiqueta}</span>
//                     </>
//                   )}
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//         <Button type="button" variant="outline" onClick={confirmar} className="px-3">
//           <PlusIcon size={16} />
//         </Button>
//       </div>
//       {value.length > 0 && (
//         <div className="mt-2 flex flex-wrap gap-1.5">
//           {value.map((tag) => (
//             <span
//               key={tag}
//               className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700 border border-emerald-200"
//             >
//               {tag}
//               <button
//                 type="button"
//                 onClick={() => onChange(value.filter((t) => t !== tag))}
//                 className="hover:text-emerald-900"
//               >
//                 <XIcon size={12} />
//               </button>
//             </span>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }