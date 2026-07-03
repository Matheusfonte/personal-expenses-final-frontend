// Mostra os botoes de paginacao.
import { Pagination as BSPagination } from 'react-bootstrap';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  // Esconde a paginacao quando so existe uma pagina.
  if (totalPages <= 1) return null;

  // Cria um botao para cada pagina.
  const items = [];
  for (let page = 1; page <= totalPages; page += 1) {
    items.push(
      <BSPagination.Item key={page} active={page === currentPage} onClick={() => onPageChange(page)}>
        {page}
      </BSPagination.Item>
    );
  }

  // Renderiza a paginacao centralizada.
  return <BSPagination className="justify-content-center mt-3">{items}</BSPagination>;
}
