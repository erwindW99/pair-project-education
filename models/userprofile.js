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
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      birthOfDate: DataTypes.DATE,
      UserId: DataTypes.INTEGER,
      phoneNumber: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "UserProfile",
    },
  );
  return UserProfile;
};
