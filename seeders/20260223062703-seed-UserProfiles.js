"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("UserProfiles", [
      {
        firstName: "Erwind",
        lastName: "Wiranata",
        birthOfDate: new Date("03/03/2004"),
        UserId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        phoneNumber: "08112233",
      },
      {
        firstName: "Farhan",
        lastName: "Izzuadi",
        birthOfDate: new Date("03/03/1777"),
        UserId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
        phoneNumber: "0811223344",
      },
    ]);
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("UserProfiles", null, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
