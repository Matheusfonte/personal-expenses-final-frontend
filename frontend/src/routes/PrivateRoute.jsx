// Protege as paginas que exigem login.
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  // Aguarda a verificacao da sessao.
  if (loading) return <div className="text-center p-5">Carregando...</div>;
  return user ? children : <Navigate to="/login" replace />;
}
