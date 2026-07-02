'use strict';

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('expenses', [
      {
        descricao: 'Almoco no restaurante',
        valor: 45.50,
        data: new Date('2024-01-15'),
        status: 'PAGA',
        categoriaId: 1,
        usuarioId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        descricao: 'Combustivel',
        valor: 150.00,
        data: new Date('2024-01-14'),
        status: 'PAGA',
        categoriaId: 2,
        usuarioId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        descricao: 'Aluguel do apartamento',
        valor: 1500.00,
        data: new Date('2024-01-01'),
        status: 'PAGA',
        categoriaId: 3,
        usuarioId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        descricao: 'Consulta medica',
        valor: 200.00,
        data: new Date('2024-01-10'),
        status: 'PENDENTE',
        categoriaId: 4,
        usuarioId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        descricao: 'Cinema',
        valor: 60.00,
        data: new Date('2024-01-13'),
        status: 'PAGA',
        categoriaId: 5,
        usuarioId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        descricao: 'Cafe',
        valor: 15.00,
        data: new Date('2024-01-16'),
        status: 'PAGA',
        categoriaId: 1,
        usuarioId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('expenses', null, {});
  },
};
