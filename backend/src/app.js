const express = require('express');
const cors = require('cors');
require('dotenv').config();

require('./models');
const authRoutes = require('./routes/autenticacao');
const categoryRoutes = require('./routes/categorias');
const dashboardRoutes = require('./routes/painel');
const expenseRoutes = require('./routes/despesas');
const { register } = require('./controllers/auth');
const { errorHandler } = require('./middlewares/auth');

const app = express();
const initialPort = Number(process.env.PORT) || 3000;

function startServer(portToUse) {
  const server = app.listen(portToUse, () => {
    console.log(`Servidor rodando na porta: http://localhost:${portToUse}`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      const nextPort = portToUse + 1;
      console.warn(`Porta ${portToUse} ocupada. Tentando ${nextPort}...`);
      startServer(nextPort);
      return;
    }

    throw error;
  });
}

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    mensagem: 'API de controle de despesas',
    documentacao: '/docs/swagger.json',
  });
});

app.post('/users', register);
app.use('/auth', authRoutes);
app.use('/categories', categoryRoutes);
app.use('/expenses', expenseRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/docs', express.static('src/docs'));
app.use('/uploads', express.static('uploads'));

app.use((req, res) => {
  res.status(404).json({ mensagem: 'Rota nao encontrada' });
});

app.use(errorHandler);

startServer(initialPort);

module.exports = app;
