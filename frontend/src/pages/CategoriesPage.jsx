// Resumo: Página de gerenciamento de categorias. Permite listar, criar,
// editar e excluir categorias, com paginação simples.
import { useEffect, useMemo, useState } from 'react';
import { Alert, Button, Card, Form, Modal, Spinner, Table } from 'react-bootstrap';
import Pagination from '../components/Pagination';
import api from '../services/api';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ nome: '', descricao: '' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  async function loadCategories() {
    setLoading(true);
    try {
      const response = await api.get('/categories');
      setCategories(response.data.categorias || []);
    } catch (err) {
      setError(err.response?.data?.mensagem || 'Não foi possível carregar categorias.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');

    try {
      if (editingId) {
        await api.put(`/categories/${editingId}`, form);
      } else {
        await api.post('/categories', form);
      }
      setForm({ nome: '', descricao: '' });
      setEditingId(null);
      setShowModal(false);
      loadCategories();
    } catch (err) {
      setError(err.response?.data?.mensagem || 'Não foi possível salvar a categoria.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (category) => {
    setForm({ nome: category.nome, descricao: category.descricao || '' });
    setEditingId(category.id);
    setShowModal(true);
  };

  const paginatedCategories = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return categories.slice(start, start + pageSize);
  }, [categories, currentPage]);

  const totalPages = Math.ceil(categories.length / pageSize);

  const handleDelete = async (id) => {
    if (!window.confirm('Deseja excluir esta categoria?')) return;

    try {
      await api.delete(`/categories/${id}`);
      loadCategories();
    } catch (err) {
      setError(err.response?.data?.mensagem || 'Não foi possível excluir a categoria.');
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Categorias</h2>
        <Button onClick={() => { setForm({ nome: '', descricao: '' }); setEditingId(null); setShowModal(true); }}>Nova categoria</Button>
      </div>
      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center py-5"><Spinner animation="border" /></div>
      ) : (
        <Card className="shadow-sm">
          <Card.Body>
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Descrição</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCategories.map((category) => (
                  <tr key={category.id}>
                    <td>{category.nome}</td>
                    <td>{category.descricao || '—'}</td>
                    <td>
                      <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEdit(category)}>Editar</Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDelete(category.id)}>Excluir</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingId ? 'Editar categoria' : 'Nova categoria'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Nome</Form.Label>
              <Form.Control value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descrição</Form.Label>
              <Form.Control as="textarea" rows={3} value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button type="submit" disabled={saving}>{saving ? 'Salvando...' : 'Salvar'}</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}
