"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcryptjs");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.UserProfile, { foreignKey: "UserId" });

      User.belongsToMany(models.Course, {
        through: models.CourseUser,
        foreignKey: "UserId",
      });

      User.belongsToMany(models.Material, {
        through: models.MaterialUser,
        foreignKey: "UserId",
      });
    }
  }
  User.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { msg: "Email already used" },
        validate: {
          notEmpty: { msg: "Email required" },
          notNull: { msg: "Email required" },
          isEmail: { msg: "This is not Email" },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Password required" },
          notNull: { msg: "Password required" },
        },
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Role required" },
          notNull: { msg: "Role required" },
        },
      },
    },
    {
      sequelize,
      modelName: "User",
    },
  );

  User.beforeCreate((el) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(el.password, salt);
    el.password = hash;
  });

  User.beforeUpdate((user) => {
    if (user.changed("password")) {
      const salt = bcrypt.genSaltSync(10);
      user.password = bcrypt.hashSync(user.password, salt);
    }
  });
  return User;
};
