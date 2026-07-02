const sequelize = require('../database');
const { DataTypes } = require('sequelize');

// Carrega os modelos
const UserModel = require('./User');
const CategoryModel = require('./Category');
const ExpenseModel = require('./Expense');

// Inicializa os modelos
const User = UserModel(sequelize);
const Category = CategoryModel(sequelize);
const Expense = ExpenseModel(sequelize);

// Define os relacionamentos
User.hasMany(Expense, {
  foreignKey: 'usuarioId',
  as: 'expenses',
});

Expense.belongsTo(User, {
  foreignKey: 'usuarioId',
  as: 'usuario',
});

Category.hasMany(Expense, {
  foreignKey: 'categoriaId',
  as: 'expenses',
});

Expense.belongsTo(Category, {
  foreignKey: 'categoriaId',
  as: 'categoria',
});

module.exports = {
  sequelize,
  User,
  Category,
  Expense,
};
