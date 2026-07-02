const { Op } = require('sequelize');
const { Category, Expense } = require('../models');

function buildExpenseFilters(query, usuarioId) {
  const where = { usuarioId };
  const { categoria, categoriaId, status, dataInicio, dataFim, valorMin, valorMax } = query;

  if (categoria || categoriaId) {
    where.categoriaId = categoria || categoriaId;
  }

  if (status) {
    if (!['PENDENTE', 'PAGA'].includes(status)) {
      const error = new Error('Status invalido. Use PENDENTE ou PAGA');
      error.status = 400;
      throw error;
    }

    where.status = status;
  }

  if (dataInicio || dataFim) {
    where.data = {};
    if (dataInicio) where.data[Op.gte] = dataInicio;
    if (dataFim) where.data[Op.lte] = dataFim;
  }

  if (valorMin || valorMax) {
    where.valor = {};
    if (valorMin) where.valor[Op.gte] = valorMin;
    if (valorMax) where.valor[Op.lte] = valorMax;
  }

  return where;
}

async function ensureCategoryExists(categoriaId) {
  const category = await Category.findByPk(categoriaId);
  return Boolean(category);
}

async function listExpenses(req, res, next) {
  try {
    const where = buildExpenseFilters(req.query, req.usuario.id);

    const despesas = await Expense.findAll({
      where,
      include: [{ model: Category, as: 'categoria', attributes: ['id', 'nome', 'descricao'] }],
      order: [['data', 'DESC'], ['id', 'DESC']],
    });

    res.json({
      mensagem: 'Despesas listadas com sucesso',
      total: despesas.length,
      despesas,
    });
  } catch (error) {
    next(error);
  }
}

async function getExpenseById(req, res, next) {
  try {
    const despesa = await Expense.findOne({
      where: {
        id: req.params.id,
        usuarioId: req.usuario.id,
      },
      include: [{ model: Category, as: 'categoria', attributes: ['id', 'nome', 'descricao'] }],
    });

    if (!despesa) {
      return res.status(404).json({ mensagem: 'Despesa nao encontrada' });
    }

    res.json({
      mensagem: 'Despesa encontrada',
      despesa,
    });
  } catch (error) {
    next(error);
  }
}

async function createExpense(req, res, next) {
  try {
    const { descricao, valor, data, status = 'PENDENTE', categoriaId } = req.body;

    if (!descricao || valor === undefined || valor === null || !categoriaId) {
      return res.status(400).json({
        mensagem: 'Descricao, valor e categoriaId sao obrigatorios',
      });
    }

    if (!(await ensureCategoryExists(categoriaId))) {
      return res.status(404).json({ mensagem: 'Categoria nao encontrada' });
    }

    const newData = {
      descricao,
      valor,
      data,
      status,
      categoriaId,
      usuarioId: req.usuario.id,
    };

    if (req.file) {
      // build a public URL for the uploaded file
      const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
      newData.comprovanteUrl = fileUrl;
    }

    const despesa = await Expense.create(newData);

    res.status(201).json({
      mensagem: 'Despesa criada com sucesso',
      despesa,
    });
  } catch (error) {
    next(error);
  }
}

async function updateExpense(req, res, next) {
  try {
    const despesa = await Expense.findOne({
      where: {
        id: req.params.id,
        usuarioId: req.usuario.id,
      },
    });

    if (!despesa) {
      return res.status(404).json({ mensagem: 'Despesa nao encontrada' });
    }

    if (req.body.categoriaId && !(await ensureCategoryExists(req.body.categoriaId))) {
      return res.status(404).json({ mensagem: 'Categoria nao encontrada' });
    }

    const updateData = {
      descricao: req.body.descricao ?? despesa.descricao,
      valor: req.body.valor ?? despesa.valor,
      data: req.body.data ?? despesa.data,
      status: req.body.status ?? despesa.status,
      categoriaId: req.body.categoriaId ?? despesa.categoriaId,
    };

    if (req.file) {
      const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
      updateData.comprovanteUrl = fileUrl;
    }

    await despesa.update(updateData);

    res.json({
      mensagem: 'Despesa atualizada com sucesso',
      despesa,
    });
  } catch (error) {
    next(error);
  }
}

async function deleteExpense(req, res, next) {
  try {
    const despesa = await Expense.findOne({
      where: {
        id: req.params.id,
        usuarioId: req.usuario.id,
      },
    });

    if (!despesa) {
      return res.status(404).json({ mensagem: 'Despesa nao encontrada' });
    }

    await despesa.destroy();

    res.json({ mensagem: 'Despesa deletada com sucesso' });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
};
