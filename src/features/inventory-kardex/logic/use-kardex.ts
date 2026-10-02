import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// Definimos la URL directa al backend de NestJS
const API_URL = 'http://localhost:3000/api/inventory/kardex';

export const fetchKardexMovements = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const useKardex = () => {
  return useQuery({
    queryKey: ['kardexMovements'],
    queryFn: fetchKardexMovements,
    refetchInterval: 3000, // Polling en tiempo real cada 3 segundos
  });
};