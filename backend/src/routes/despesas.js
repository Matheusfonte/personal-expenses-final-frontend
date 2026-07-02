const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
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
router.post('/', upload.single('comprovante'), createExpense);
router.put('/:id', upload.single('comprovante'), updateExpense);
router.delete('/:id', deleteExpense);

module.exports = router;
