"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    static async search(search) {
      const { Op } = require("sequelize");
      const Material = this.sequelize.models.Material;

      if (search) {
        return this.findAll({
          include: Material,
          where: {
            name: {
              [Op.iLike]: `%${search}%`,
            },
          },
        });
      } else {
        return this.findAll({
          include: Material,
        });
      }
    }
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Course.hasMany(models.Material, { foreignKey: "CourseId" });

      Course.hasMany(models.CourseUser, { foreignKey: "CourseId" });

      Course.belongsToMany(models.User, {
        through: models.CourseUser,
        foreignKey: "CourseId",
      });
    }
  }
  Course.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Name is required" },
          notEmpty: { msg: "Name is required" },
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: { msg: "Description is required" },
          notEmpty: { msg: "Description is required" },
        },
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "Price is required" },
          notEmpty: { msg: "Price is required" },
        },
      },
      code: DataTypes.STRING,
      category: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Category is required" },
          notEmpty: { msg: "Category is required" },
        },
      },
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
