'use strict';

const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('senha123', 10);

    return queryInterface.bulkInsert('users', [
      {
        nome: 'Matheus Goncalves',
        email: 'matheus@example.com',
        senha: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nome: 'Joao Silva',
        email: 'joao@example.com',
        senha: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('users', null, {});
  },
};
