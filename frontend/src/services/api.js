// Configura o cliente HTTP da API.
import axios from 'axios';

// Define a URL base e o tempo maximo das requisicoes.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  timeout: 10000,
});

// Exporta a instancia para as paginas usarem.
export default api;


