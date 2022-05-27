"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */

    return queryInterface.bulkInsert("Users", [
      {
        password: "$2a$10$eLOHPetSi6Uq16w5vMfBVeMvIM.VjsUY4rBs93tyagiPNZhKI7xHS",
        firstName: "John",
        lastName: "Doe",
        email: "admin",
        phonenumber: '32323',
        roleId: 'R1',
        positionId: 'P3',
        gender: 'M',
        address: '1234',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        password: "$2a$10$eLOHPetSi6Uq16w5vMfBVeMvIM.VjsUY4rBs93tyagiPNZhKI7xHS",
        firstName: "John",
        lastName: "Doe",
        email: "doctor",
        phonenumber: '32323',
        roleId: 'R2',
        positionId: 'P3',
        gender: 'M',
        address: '1234',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
