const express = require('express');
const { 
  getTotalExpenses, 
  getExpensesCount, 
  getExpensesByCategory 
} = require('../controllers/dashboard');
const { authenticateToken } = require('../middlewares/auth');

const router = express.Router();

// Aplicar middleware de autenticação a todas as rotas
router.use(authenticateToken);

// Rotas de dashboard/estatísticas
router.get('/total-expenses', getTotalExpenses);
router.get('/expenses-count', getExpensesCount);
router.get('/expenses-by-category', getExpensesByCategory);

module.exports = router;
