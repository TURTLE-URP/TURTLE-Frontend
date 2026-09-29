import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchInsumoDetalle } from './api'
import { MOCK_ALERTAS_STOCK, MOCK_MEDIDAS_ALTERNAS } from './mock'
import { alertaStockSchema, medidaAlternaSchema } from './schema'
import type { AlertaStock, MedidaAlterna } from './types'

export function useInsumoDetalle(insumoId: string) {
  return useQuery({
    queryKey: ['insumo-detalle', insumoId],
    queryFn: () => fetchInsumoDetalle(insumoId),
  })
}

/**
 * Estado y acciones para una tabla editable "en línea": agregar fila,
 * editar fila existente, confirmar/cancelar cambios y eliminar.
 * Se reutiliza la misma forma para Medidas Alternas y Alertas de Stock.
 */
function useFilaEditable<T extends { id: string }>(
  datosIniciales: T[],
  filaVacia: Omit<T, 'id'>,
) {
  const [filas, setFilas] = useState<T[]>(datosIniciales)
  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [borrador, setBorrador] = useState<Partial<T>>({})
  const [errores, setErrores] = useState<Record<string, string>>({})

  function agregarFila() {
    const tempId = `temp-${Date.now()}`
    const nueva = { ...filaVacia, id: tempId } as T
    setFilas((prev) => [...prev, nueva])
    setEditandoId(tempId)
    setBorrador(nueva)
    setErrores({})
  }

  function editarFila(fila: T) {
    setEditandoId(fila.id)
    setBorrador(fila)
    setErrores({})
  }

  function actualizarCampo(campo: keyof T, valor: string | number) {
    setBorrador((prev) => ({ ...prev, [campo]: valor }))
  }

  function cancelar() {
    if (editandoId?.startsWith('temp-')) {
      setFilas((prev) => prev.filter((f) => f.id !== editandoId))
    }
    setEditandoId(null)
    setBorrador({})
    setErrores({})
  }

  function eliminarFila(id: string) {
    setFilas((prev) => prev.filter((f) => f.id !== id))
  }

  return {
    filas,
    editandoId,
    borrador,
    errores,
    setErrores,
    agregarFila,
    editarFila,
    actualizarCampo,
    cancelar,
    eliminarFila,
    setFilas,
    setEditandoId,
    setBorrador,
  }
}

export function useMedidasAlternas() {
  const tabla = useFilaEditable<MedidaAlterna>(MOCK_MEDIDAS_ALTERNAS, {
    nombre: '',
    abreviatura: '',
    factorABase: 0,
    uso: '',
  })

  function confirmarFila() {
    const resultado = medidaAlternaSchema.safeParse(tabla.borrador)
    if (!resultado.success) {
      const campos = resultado.error.flatten().fieldErrors
      tabla.setErrores(
        Object.fromEntries(
          Object.entries(campos).map(([campo, mensajes]) => [campo, mensajes?.[0] ?? '']),
        ),
      )
      return
    }
    tabla.setFilas((prev) =>
      prev.map((m) => (m.id === tabla.editandoId ? { ...m, ...resultado.data } : m)),
    )
    tabla.setEditandoId(null)
    tabla.setBorrador({})
    tabla.setErrores({})
  }

  return { ...tabla, confirmarFila }
}

export function useAlertasStock() {
  const tabla = useFilaEditable<AlertaStock>(MOCK_ALERTAS_STOCK, {
    alcance: '',
    minimo: 0,
    cantidadAReponer: undefined,
  })

  function confirmarFila() {
    const resultado = alertaStockSchema.safeParse(tabla.borrador)
    if (!resultado.success) {
      const campos = resultado.error.flatten().fieldErrors
      tabla.setErrores(
        Object.fromEntries(
          Object.entries(campos).map(([campo, mensajes]) => [campo, mensajes?.[0] ?? '']),
        ),
      )
      return
    }
    tabla.setFilas((prev) =>
      prev.map((a) => (a.id === tabla.editandoId ? { ...a, ...resultado.data } : a)),
    )
    tabla.setEditandoId(null)
    tabla.setBorrador({})
    tabla.setErrores({})
  }

  return { ...tabla, confirmarFila }
}
