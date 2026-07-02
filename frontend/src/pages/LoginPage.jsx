// Resumo: Tela de login. Faz a autenticação do usuário via API e salva
// token/usuário no contexto para sessão persistente.
import { useState } from 'react';
import { Alert, Button, Card, Form, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('matheus@example.com');
  const [senha, setSenha] = useState('senha123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // LoginPage é a tela de autenticação. Aqui o usuário entra com email e senha.
  // Ao submeter, ele chama o login do AuthContext para obter o token JWT.

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, senha);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.mensagem || 'Não foi possível entrar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100">
      <Card style={{ width: '100%', maxWidth: 420 }} className="shadow">
        <Card.Body className="p-4">
          <h3 className="mb-3">Acessar conta</h3>
          <p className="text-muted">Entre com suas credenciais para continuar.</p>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Senha</Form.Label>
              <Form.Control type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required />
            </Form.Group>
            <Button type="submit" className="w-100" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : 'Entrar'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}
