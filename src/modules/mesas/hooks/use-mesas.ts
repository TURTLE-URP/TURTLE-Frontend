import { useCallback, useEffect, useState } from 'react'
import { useAuthStore } from '@/shared/stores/auth-store'
import type { Mesa } from '../interfaces/mesa'
import { mapMesa, toPisoApi } from '../lib/map-mesa'
import { MesasApi, type UpdateOcupadoPayload } from '../services/mesas.api'

export function useMesas() {
  const [mesas, setMesas] = useState<Mesa[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (!useAuthStore.getState().session?.token) {
      setMesas([])
      setError('Inicia sesión para ver el estado de las mesas.')
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const data = await MesasApi.findAll()
      setMesas(data.map(mapMesa))
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al conectar con el servidor'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const guardar = useCallback(
    async (mesaData: Omit<Mesa, 'id'> & { id?: number }) => {
      if (!mesaData.id) {
        throw new Error('Solo se puede editar una mesa existente.')
      }
      const actual = mesas.find((mesa) => mesa.id === mesaData.id)
      if (!actual) {
        throw new Error('Mesa no encontrada')
      }
      await MesasApi.update(actual.numero, {
        numero: mesaData.numero,
        capacidad: mesaData.capacidad,
        piso: toPisoApi(mesaData.piso),
        ocupado: mesaData.ocupado,
      })
      await refresh()
    },
    [mesas, refresh],
  )

  const setOcupado = useCallback(
    async (id: number, dto: UpdateOcupadoPayload) => {
      const actual = mesas.find((mesa) => mesa.id === id)
      if (!actual) {
        throw new Error('Mesa no encontrada')
      }
      await MesasApi.updateOcupado(actual.numero, dto)
      await refresh()
    },
    [mesas, refresh],
  )

  return { mesas, loading, error, refresh, guardar, setOcupado }
}
