import { useEffect, useMemo, useState } from 'react';
import { Alert, Badge, Button, Card, Col, Form, Modal, Row, Spinner, Table } from 'react-bootstrap';
import Pagination from '../components/Pagination';
import api from '../services/api';

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ descricao: '', valor: '', data: '', status: 'PENDENTE', categoriaId: '' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({ status: '', categoria: '', dataInicio: '', dataFim: '', valorMin: '', valorMax: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  const [sortBy, setSortBy] = useState('data');
  const [sortDir, setSortDir] = useState('desc');
  const [comprovanteFile, setComprovanteFile] = useState(null);

  async function loadData() {
    setLoading(true);
    try {
      const [expensesRes, categoriesRes] = await Promise.all([
        api.get('/expenses', { params: buildFiltersParams(filters) }),
        api.get('/categories')
      ]);
      setExpenses(expensesRes.data.despesas || []);
      setCategories(categoriesRes.data.categorias || []);
    } catch (err) {
      setError(err.response?.data?.mensagem || 'Não foi possível carregar despesas.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const buildFiltersParams = (values) => {
    const params = {};
    if (values.status) params.status = values.status;
    if (values.categoria) params.categoria = values.categoria;
    if (values.dataInicio) params.dataInicio = values.dataInicio;
    if (values.dataFim) params.dataFim = values.dataFim;
    if (values.valorMin) params.valorMin = values.valorMin;
    if (values.valorMax) params.valorMax = values.valorMax;
    return params;
  };

  const handleFilterSubmit = (event) => {
    event.preventDefault();
    loadData();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');

    try {
      // Support file upload if comprovanteFile is provided
      if (comprovanteFile) {
        const formData = new FormData();
        formData.append('descricao', form.descricao);
        formData.append('valor', Number(form.valor));
        formData.append('data', form.data);
        formData.append('status', form.status);
        formData.append('categoriaId', Number(form.categoriaId));
        formData.append('comprovante', comprovanteFile);

        if (editingId) {
          await api.put(`/expenses/${editingId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        } else {
          await api.post('/expenses', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        }
      } else {
        const payload = { ...form, valor: Number(form.valor), categoriaId: Number(form.categoriaId) };
        if (editingId) {
          await api.put(`/expenses/${editingId}`, payload);
        } else {
          await api.post('/expenses', payload);
        }
      }
      setForm({ descricao: '', valor: '', data: '', status: 'PENDENTE', categoriaId: '' });
      setEditingId(null);
      setShowModal(false);
      setComprovanteFile(null);
      loadData();
    } catch (err) {
      setError(err.response?.data?.mensagem || 'Não foi possível salvar a despesa.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (expense) => {
    setForm({
      descricao: expense.descricao,
      valor: expense.valor,
      data: expense.data,
      status: expense.status,
      categoriaId: expense.categoriaId || expense.categoria?.id || ''
    });
    setComprovanteFile(null);
    setEditingId(expense.id);
    setShowModal(true);
  };

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortDir('asc');
    }
    setCurrentPage(1);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deseja excluir esta despesa?')) return;

    try {
      await api.delete(`/expenses/${id}`);
      loadData();
    } catch (err) {
      setError(err.response?.data?.mensagem || 'Não foi possível excluir a despesa.');
    }
  };

  const total = useMemo(() => expenses.reduce((sum, expense) => sum + Number(expense.valor || 0), 0), [expenses]);
  const paginatedExpenses = useMemo(() => {
    // Apply sorting client-side
    const sorted = [...expenses].sort((a, b) => {
      let aVal = a[sortBy] ?? '';
      let bVal = b[sortBy] ?? '';
      if (sortBy === 'categoria') {
        aVal = a.categoria?.nome || a.categoria || '';
        bVal = b.categoria?.nome || b.categoria || '';
      }
      if (sortBy === 'valor') {
        return sortDir === 'asc' ? Number(aVal) - Number(bVal) : Number(bVal) - Number(aVal);
      }
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    const start = (currentPage - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [expenses, currentPage, sortBy, sortDir]);

  const totalPages = Math.ceil(expenses.length / pageSize);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Despesas</h2>
        <Button onClick={() => { setForm({ descricao: '', valor: '', data: '', status: 'PENDENTE', categoriaId: '' }); setEditingId(null); setComprovanteFile(null); setShowModal(true); }}>Nova despesa</Button>
      </div>
      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Form onSubmit={handleFilterSubmit}>
            <Row className="g-3">
              <Col md={3}>
                <Form.Label>Categoria</Form.Label>
                <Form.Select value={filters.categoria} onChange={(e) => setFilters({ ...filters, categoria: e.target.value })}>
                  <option value="">Todas</option>
                  {categories.map((category) => <option key={category.id} value={category.id}>{category.nome}</option>)}
                </Form.Select>
              </Col>
              <Col md={2}>
                <Form.Label>Status</Form.Label>
                <Form.Select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
                  <option value="">Todos</option>
                  <option value="PENDENTE">Pendente</option>
                  <option value="PAGA">Paga</option>
                </Form.Select>
              </Col>
              <Col md={2}>
                <Form.Label>Data inicial</Form.Label>
                <Form.Control type="date" value={filters.dataInicio} onChange={(e) => setFilters({ ...filters, dataInicio: e.target.value })} />
              </Col>
              <Col md={2}>
                <Form.Label>Data final</Form.Label>
                <Form.Control type="date" value={filters.dataFim} onChange={(e) => setFilters({ ...filters, dataFim: e.target.value })} />
              </Col>
              <Col md={3}>
                <Form.Label>Valor</Form.Label>
                <div className="d-flex gap-2">
                  <Form.Control type="number" placeholder="Min" value={filters.valorMin} onChange={(e) => setFilters({ ...filters, valorMin: e.target.value })} />
                  <Form.Control type="number" placeholder="Max" value={filters.valorMax} onChange={(e) => setFilters({ ...filters, valorMax: e.target.value })} />
                </div>
              </Col>
            </Row>
            <div className="mt-3">
              <Button type="submit">Aplicar filtros</Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      <Card className="shadow-sm mb-3">
        <Card.Body>
          <strong>Total filtrado:</strong> R$ {total.toFixed(2)}
        </Card.Body>
      </Card>

      {loading ? (
        <div className="text-center py-5"><Spinner animation="border" /></div>
      ) : (
        <Card className="shadow-sm">
          <Card.Body>
            <Table responsive hover>
              <thead>
                <tr>
                  <th style={{ cursor: 'pointer' }} onClick={() => toggleSort('descricao')}>Descrição {sortBy === 'descricao' ? (sortDir === 'asc' ? '▲' : '▼') : ''}</th>
                  <th style={{ cursor: 'pointer' }} onClick={() => toggleSort('valor')}>Valor {sortBy === 'valor' ? (sortDir === 'asc' ? '▲' : '▼') : ''}</th>
                  <th style={{ cursor: 'pointer' }} onClick={() => toggleSort('status')}>Status {sortBy === 'status' ? (sortDir === 'asc' ? '▲' : '▼') : ''}</th>
                  <th style={{ cursor: 'pointer' }} onClick={() => toggleSort('categoria')}>Categoria {sortBy === 'categoria' ? (sortDir === 'asc' ? '▲' : '▼') : ''}</th>
                  <th style={{ cursor: 'pointer' }} onClick={() => toggleSort('data')}>Data {sortBy === 'data' ? (sortDir === 'asc' ? '▲' : '▼') : ''}</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {paginatedExpenses.map((expense) => (
                  <tr key={expense.id}>
                    <td>{expense.descricao}</td>
                    <td>R$ {Number(expense.valor).toFixed(2)}</td>
                    <td><Badge bg={expense.status === 'PAGA' ? 'success' : 'warning'}>{expense.status}</Badge></td>
                    <td>{expense.categoria?.nome || expense.categoria}</td>
                    <td>{expense.data}</td>
                    <td>
                      <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEdit(expense)}>Editar</Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDelete(expense.id)}>Excluir</Button>
                      {expense.comprovanteUrl ? (
                        <a className="ms-2" href={expense.comprovanteUrl} target="_blank" rel="noreferrer">Comprovante</a>
                      ) : null}
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
          <Modal.Title>{editingId ? 'Editar despesa' : 'Nova despesa'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Descrição</Form.Label>
              <Form.Control value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} required />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Valor</Form.Label>
                  <Form.Control type="number" step="0.01" value={form.valor} onChange={(e) => setForm({ ...form, valor: e.target.value })} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Data</Form.Label>
                  <Form.Control type="date" value={form.data} onChange={(e) => setForm({ ...form, data: e.target.value })} required />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                    <option value="PENDENTE">Pendente</option>
                    <option value="PAGA">Paga</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Categoria</Form.Label>
                  <Form.Select value={form.categoriaId} onChange={(e) => setForm({ ...form, categoriaId: e.target.value })} required>
                    <option value="">Selecione</option>
                    {categories.map((category) => <option key={category.id} value={category.id}>{category.nome}</option>)}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Comprovante (opcional)</Form.Label>
              <Form.Control type="file" onChange={(e) => setComprovanteFile(e.target.files?.[0] || null)} />
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
