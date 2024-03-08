const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  const File = sequelize.define(
    "files",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nameFile: {
        type: DataTypes.TEXT("long"),
        allowNull: false,
      },
      status: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      timestamps: true,
    }
  );

  return File;
};
