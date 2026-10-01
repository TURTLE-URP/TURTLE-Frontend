import { useQuery } from '@tanstack/react-query';
import { fetchKardexMovements } from './kardex-api';

export const useKardex = () => {
  return useQuery({
    queryKey: ['kardexMovements'],
    queryFn: fetchKardexMovements,
    refetchInterval: 3000, // ¡Esto hace la magia de consultar cada 3 segundos en tiempo real!
  });
};