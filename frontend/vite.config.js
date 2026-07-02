// Resumo: Configuração do Vite para o frontend. Define plugins (React)
// e opções do servidor de desenvolvimento (host/porta). Não contém lógica
// de runtime — apenas ajusta o dev server e bundling.
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5174,
    strictPort: true,
  },
});
