const { Category } = require('../models');

async function listCategories(req, res, next) {
  try {
    const categorias = await Category.findAll({
      order: [['nome', 'ASC']],
    });

    res.json({
      mensagem: 'Categorias listadas com sucesso',
      total: categorias.length,
      categorias,
    });
  } catch (error) {
    next(error);
  }
}

async function getCategoryById(req, res, next) {
  try {
    const { id } = req.params;

    const categoria = await Category.findByPk(id);
    if (!categoria) {
      return res.status(404).json({
        mensagem: 'Categoria nao encontrada',
      });
    }

    res.json({
      mensagem: 'Categoria encontrada',
      categoria,
    });
  } catch (error) {
    next(error);
  }
}

async function createCategory(req, res, next) {
  try {
    const { nome, descricao } = req.body;

    if (!nome) {
      return res.status(400).json({
        mensagem: 'Nome e obrigatorio',
      });
    }

    const categoriaExistente = await Category.findOne({ where: { nome } });
    if (categoriaExistente) {
      return res.status(400).json({
        mensagem: 'Categoria com este nome ja existe',
      });
    }

    const categoria = await Category.create({
      nome,
      descricao,
    });

    res.status(201).json({
      mensagem: 'Categoria criada com sucesso',
      categoria,
    });
  } catch (error) {
    next(error);
  }
}

async function updateCategory(req, res, next) {
  try {
    const { id } = req.params;
    const { nome, descricao } = req.body;

    const categoria = await Category.findByPk(id);
    if (!categoria) {
      return res.status(404).json({
        mensagem: 'Categoria nao encontrada',
      });
    }

    if (nome && nome !== categoria.nome) {
      const nomeExistente = await Category.findOne({ where: { nome } });
      if (nomeExistente) {
        return res.status(400).json({
          mensagem: 'Categoria com este nome ja existe',
        });
      }
    }

    await categoria.update({
      nome: nome || categoria.nome,
      descricao: descricao !== undefined ? descricao : categoria.descricao,
    });

    res.json({
      mensagem: 'Categoria atualizada com sucesso',
      categoria,
    });
  } catch (error) {
    next(error);
  }
}

async function deleteCategory(req, res, next) {
  try {
    const { id } = req.params;

    const categoria = await Category.findByPk(id);
    if (!categoria) {
      return res.status(404).json({
        mensagem: 'Categoria nao encontrada',
      });
    }

    await categoria.destroy();

    res.json({
      mensagem: 'Categoria deletada com sucesso',
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
