import { useState } from 'react'
import { useDebouncedValue } from '@/shared/hooks/use-debounced-value'
import {
  useActualizarInsumo,
  useCrearInsumo,
  useInsumosList,
} from '../services/queries'

/**
 * Estado UI del listado (búsqueda + página) + query y mutaciones.
 * La data vive en el backend (GET /supplies?search=&page=&limit=);
 * cada mutación exitosa invalida ['insumos'] y fuerza la recarga.
 */
export function useInsumos() {
  const [busqueda, setBusqueda] = useState('')
  const [pagina, setPagina] = useState(1)
  const busquedaDebounced = useDebouncedValue(busqueda)

  const listado = useInsumosList(busquedaDebounced || undefined, pagina)
  const crear = useCrearInsumo()
  const actualizar = useActualizarInsumo()

  const cambiarBusqueda = (valor: string) => {
    setBusqueda(valor)
    setPagina(1)
  }

  return {
    busqueda,
    cambiarBusqueda,
    pagina,
    setPagina,
    insumos: listado.data?.insumos ?? [],
    meta: listado.data?.meta,
    isLoading: listado.isLoading,
    isError: listado.isError,
    crear,
    actualizar,
  }
}
