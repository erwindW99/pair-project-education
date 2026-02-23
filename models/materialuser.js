"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class MaterialUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  MaterialUser.init(
    {
      UserId: DataTypes.INTEGER,
      MaterialId: DataTypes.INTEGER,
      isFinished: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "MaterialUser",
    },
  );
  return MaterialUser;
};
