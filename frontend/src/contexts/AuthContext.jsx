// Resumo: Contexto de autenticação. Gerencia login, logout e mantém
// token JWT no localStorage para requisições autenticadas.
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('expense-user');
    const storedToken = localStorage.getItem('expense-token');

    if (storedUser && storedToken) {
      api.defaults.headers.common.Authorization = `Bearer ${storedToken}`;
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  // O useEffect inicializa a autenticação usando dados do localStorage,
  // mantendo o usuário logado mesmo após atualizar a página.

  const login = async (email, senha) => {
    const response = await api.post('/auth/login', { email, senha });
    const { token, usuario } = response.data;

    localStorage.setItem('expense-token', token);
    localStorage.setItem('expense-user', JSON.stringify(usuario));
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    setUser(usuario);
  };

  // O login salva token e usuário no localStorage e configura o header Authorization
  // para que todas as requisições seguintes usem o token JWT.

  const logout = () => {
    localStorage.removeItem('expense-token');
    localStorage.removeItem('expense-user');
    delete api.defaults.headers.common.Authorization;
    setUser(null);
  };

  // O logout remove os dados de sessão e limpa o header de autorização.

  const value = useMemo(() => ({ user, loading, login, logout }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
