import { Pagination as BSPagination } from 'react-bootstrap';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const items = [];
  for (let page = 1; page <= totalPages; page += 1) {
    items.push(
      <BSPagination.Item key={page} active={page === currentPage} onClick={() => onPageChange(page)}>
        {page}
      </BSPagination.Item>
    );
  }

  return <BSPagination className="justify-content-center mt-3">{items}</BSPagination>;
}
