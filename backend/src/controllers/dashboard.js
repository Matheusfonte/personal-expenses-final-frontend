const { Category, Expense } = require('../models');

async function getTotalExpenses(req, res, next) {
  try {
    const total = await Expense.sum('valor', {
      where: {
        usuarioId: req.usuario.id,
      },
    });

    res.json({ total: Number(total || 0) });
  } catch (error) {
    next(error);
  }
}

async function getExpensesCount(req, res, next) {
  try {
    const quantidade = await Expense.count({
      where: { usuarioId: req.usuario.id },
    });

    res.json({ quantidade });
  } catch (error) {
    next(error);
  }
}

async function getExpensesByCategory(req, res, next) {
  try {
    const resultado = await Expense.findAll({
      attributes: [
        [Expense.sequelize.fn('SUM', Expense.sequelize.col('valor')), 'total'],
      ],
      include: [
        {
          model: Category,
          as: 'categoria',
          attributes: ['nome'],
          required: true,
        },
      ],
      where: {
        usuarioId: req.usuario.id,
      },
      group: ['categoria.id', 'categoria.nome'],
    });

    res.json(resultado.map((item) => ({
      categoria: item.categoria.nome,
      total: Number(item.get('total')),
    })));
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getTotalExpenses,
  getExpensesCount,
  getExpensesByCategory,
};
