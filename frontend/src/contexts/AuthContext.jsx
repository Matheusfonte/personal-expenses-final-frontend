// Guarda os dados de autenticacao do usuario.
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Controla usuario logado e carregamento inicial.
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Recupera a sessao salva no navegador.
  useEffect(() => {
    const storedUser = localStorage.getItem('expense-user');
    const storedToken = localStorage.getItem('expense-token');

    if (storedUser && storedToken) {
      api.defaults.headers.common.Authorization = `Bearer ${storedToken}`;
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  // Faz login e salva o token JWT.
  const login = async (email, senha) => {
    const response = await api.post('/auth/login', { email, senha });
    const { token, usuario } = response.data;

    localStorage.setItem('expense-token', token);
    localStorage.setItem('expense-user', JSON.stringify(usuario));
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    setUser(usuario);
  };

  // Encerra a sessao do usuario.
  const logout = () => {
    localStorage.removeItem('expense-token');
    localStorage.removeItem('expense-user');
    delete api.defaults.headers.common.Authorization;
    setUser(null);
  };

  // Evita recriar o objeto do contexto sem necessidade.
  const value = useMemo(() => ({ user, loading, login, logout }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Facilita o acesso ao contexto de autenticacao.
export function useAuth() {
  return useContext(AuthContext);
}
