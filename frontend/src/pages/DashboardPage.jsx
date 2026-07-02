// Resumo: Dashboard com resumo financeiro e gráfico por categoria.
// Busca estatísticas e últimas despesas da API para exibir ao usuário.
import { useEffect, useState } from 'react';
import { Alert, Badge, Card, Col, Row, Spinner, Table } from 'react-bootstrap';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import api from '../services/api';

export default function DashboardPage() {
  const [stats, setStats] = useState({ total: 0, quantidade: 0, porCategoria: [] });
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [totalRes, countRes, categoryRes, expensesRes] = await Promise.all([
          api.get('/dashboard/total-expenses'),
          api.get('/dashboard/expenses-count'),
          api.get('/dashboard/expenses-by-category'),
          api.get('/expenses?limit=5')
        ]);

        setStats({
          total: totalRes.data.total || 0,
          quantidade: countRes.data.quantidade || 0,
          porCategoria: categoryRes.data || []
        });
        setRecentExpenses(expensesRes.data.despesas || []);
      } catch (err) {
        setError(err.response?.data?.mensagem || 'Não foi possível carregar o dashboard.');
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return <div className="text-center py-5"><Spinner animation="border" /></div>;
  }

  return (
    <div>
      <h2 className="mb-4">Dashboard</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Row className="g-3 mb-4">
        <Col md={4}>
          <Card className="shadow-sm h-100">
            <Card.Body>
              <Card.Title>Total de gastos</Card.Title>
              <h3 className="text-primary">R$ {Number(stats.total).toFixed(2)}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm h-100">
            <Card.Body>
              <Card.Title>Quantidade de despesas</Card.Title>
              <h3 className="text-success">{stats.quantidade}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm h-100">
            <Card.Body>
              <Card.Title>Gastos por categoria</Card.Title>
              {stats.porCategoria.map((item) => (
                <div key={item.categoria} className="d-flex justify-content-between">
                  <span>{item.categoria}</span>
                  <Badge bg="info">R$ {Number(item.total).toFixed(2)}</Badge>
                </div>
              ))}
              {stats.porCategoria.length > 0 && (
                <div className="mt-3">
                  <Pie data={{ labels: stats.porCategoria.map(i => i.categoria), datasets: [{ data: stats.porCategoria.map(i => Number(i.total)), backgroundColor: [ '#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b', '#858796' ] }] }} />
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="shadow-sm">
        <Card.Body>
          <Card.Title>Últimas despesas cadastradas</Card.Title>
          <Table responsive hover>
            <thead>
              <tr>
                <th>Descrição</th>
                <th>Valor</th>
                <th>Status</th>
                <th>Categoria</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody>
              {recentExpenses.map((expense) => (
                <tr key={expense.id}>
                  <td>{expense.descricao}</td>
                  <td>R$ {Number(expense.valor).toFixed(2)}</td>
                  <td><Badge bg={expense.status === 'PAGA' ? 'success' : 'warning'}>{expense.status}</Badge></td>
                  <td>{expense.categoria?.nome}</td>
                  <td>{expense.data}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
}
