import axios from 'axios';

// URL base de tu backend (ajustaremos la ruta exacta cuando clones el backend)
const API_URL = 'http://localhost:3000/api/inventory'; 

export const fetchKardexMovements = async () => {
  const response = await axios.get(`${API_URL}/kardex`);
  return response.data;
};