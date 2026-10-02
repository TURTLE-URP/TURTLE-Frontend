import { useInfiniteQuery } from '@tanstack/react-query'
import { useDebouncedValue } from '@/shared/hooks/use-debounced-value'
import { fetchAlmacenesOptions } from '../services/almacen-options.api'

/**
 * Opciones de almacenes para combobox con infinite scroll (cursor).
 * La búsqueda va con debounce; cada cambio reinicia el cursor.
 */
export function useAlmacenesOptions(search: string, limit = 10) {
  const searchDebounced = useDebouncedValue(search)

  const query = useInfiniteQuery({
    queryKey: ['almacenes', 'options', searchDebounced],
    queryFn: ({ pageParam, signal }) =>
      fetchAlmacenesOptions({
        search: searchDebounced || undefined,
        cursor: pageParam,
        limit,
        signal,
      }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasMore ? (lastPage.meta.nextCursor ?? undefined) : undefined,
  })

  return {
    ...query,
    opciones: query.data?.pages.flatMap((page) => page.data) ?? [],
  }
}
