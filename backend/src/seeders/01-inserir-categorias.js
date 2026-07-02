'use strict';

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('categories', [
      {
        nome: 'Alimentacao',
        descricao: 'Despesas com alimentacao e refeicoes',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nome: 'Transporte',
        descricao: 'Despesas com transporte e combustivel',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nome: 'Moradia',
        descricao: 'Despesas com aluguel e contas da casa',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nome: 'Saude',
        descricao: 'Despesas medicas e farmaceuticas',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nome: 'Entretenimento',
        descricao: 'Despesas com lazer e entretenimento',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('categories', null, {});
  },
};
