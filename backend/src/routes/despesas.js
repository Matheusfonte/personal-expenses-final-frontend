const express = require('express');
const { 
  listExpenses, 
  getExpenseById, 
  createExpense, 
  updateExpense, 
  deleteExpense 
} = require('../controllers/expense');
const { authenticateToken } = require('../middlewares/auth');

const router = express.Router();

// Aplicar middleware de autenticação a todas as rotas
router.use(authenticateToken);

// Rotas de despesas
router.get('/', listExpenses);
router.get('/:id', getExpenseById);
router.post('/', createExpense);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);

module.exports = router;
