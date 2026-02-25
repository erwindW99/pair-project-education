"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Course.hasMany(models.Material, { foreignKey: "CourseId" });

      Course.belongsToMany(models.User, {
        through: models.CourseUser,
        foreignKey: "CourseId",
      });
    }
  }
  Course.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
      price: DataTypes.INTEGER,
      code: DataTypes.STRING,
      category: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Course",
    },
  );

  Course.beforeCreate((el) => {
    el.code = `${el.category.toLowerCase().replace(" ", "_")}-${new Date().getFullYear()}`;
  });
  return Course;
};
