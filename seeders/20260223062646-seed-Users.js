"use strict";
const bcrypt = require("bcryptjs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Users", [
      {
        email: "erwind@gmail.com",
        password: bcrypt.hashSync("erwind123", 8),
        role: "Teacher",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: "farhan@gmail.com",
        password: bcrypt.hashSync("farhan123", 8),
        role: "Student",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
