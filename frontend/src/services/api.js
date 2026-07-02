// Resumo: Instância Axios central usada por todo o frontend para
// chamar a API do backend (baseURL definido em frontend/.env).
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  timeout: 10000,
});

export default api;


