const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const TimeDelete = sequelize.define(
      "timedelete",
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        xNumber: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
      },
      {
        timestamps: true,
      }
    );
  
    return TimeDelete;
  };
  