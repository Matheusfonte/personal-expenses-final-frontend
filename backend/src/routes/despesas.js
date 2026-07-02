const express = require('express');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage });
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
