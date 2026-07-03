// Monta a barra de navegacao das paginas logadas.
import { Button, Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

export default function HeaderNav() {
  // Busca usuario, logout e tema nos contextos.
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Sai da conta e volta para o login.
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar bg={theme === 'dark' ? 'dark' : 'light'} variant={theme === 'dark' ? 'dark' : 'light'} expand="lg" className="mb-4 navbar-showcase">
      <Container>
        <Navbar.Brand as={Link} to="/">Controle de Despesas</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Dashboard</Nav.Link>
            <Nav.Link as={Link} to="/categories">Categorias</Nav.Link>
            <Nav.Link as={Link} to="/expenses">Despesas</Nav.Link>
          </Nav>
          <Button variant={theme === 'dark' ? 'light' : 'outline-light'} size="sm" className="me-2" onClick={toggleTheme}>
            {theme === 'dark' ? '☀️' : '🌙'}
          </Button>
          <NavDropdown title={user?.nome || 'Conta'} id="basic-nav-dropdown">
            <NavDropdown.Item onClick={handleLogout}>Sair</NavDropdown.Item>
          </NavDropdown>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
