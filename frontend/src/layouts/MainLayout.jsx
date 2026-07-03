// Monta a estrutura principal das paginas logadas.
import { Container } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import HeaderNav from '../components/Header/Nav';
import CartoonBanner from '../components/ui/CartoonBanner';

export default function MainLayout() {
  return (
    <>
      {/* Barra de navegacao do sistema. */}
      <HeaderNav />

      {/* Area onde cada pagina interna aparece. */}
      <Container className="pb-4">
        <CartoonBanner />
        <Outlet />
      </Container>
    </>
  );
}
