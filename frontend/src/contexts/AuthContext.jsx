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

  const login = async (email, senha) => {
    const response = await api.post('/auth/login', { email, senha });
    const { token, usuario } = response.data;

    localStorage.setItem('expense-token', token);
    localStorage.setItem('expense-user', JSON.stringify(usuario));
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    setUser(usuario);
  };

  const logout = () => {
    localStorage.removeItem('expense-token');
    localStorage.removeItem('expense-user');
    delete api.defaults.headers.common.Authorization;
    setUser(null);
  };

  const value = useMemo(() => ({ user, loading, login, logout }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
