"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserProfile extends Model {
    get birthOfDateFormatted() {
      const formattedDate = this.birthOfDate.toISOString().split("T")[0];
      return formattedDate;
    }
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserProfile.belongsTo(models.User, { foreignKey: "UserId" });
    }
  }
  UserProfile.init(
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "First Name required" },
          notNull: { msg: "First Name required" },
        },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Last Name required" },
          notNull: { msg: "Last Name required" },
        },
      },
      birthOfDate: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notEmpty: { msg: "BirthOfDate required" },
          notNull: { msg: "BirthOfDate required" },
          validateAge(value) {
            const currentYear = new Date().getFullYear();
            const birthYear = new Date(value).getFullYear();
            const age = currentYear - birthYear;
            if (age < 10) {
              throw new Error("age must be at least 10 years old");
            }
          },
        },
      },
      UserId: DataTypes.INTEGER,
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Phone Number required" },
          notNull: { msg: "Phone Number required" },
        },
      },
    },
    {
      sequelize,
      modelName: "UserProfile",
    },
  );
  return UserProfile;
};
