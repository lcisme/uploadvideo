const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    "users",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      password: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      status: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      hashToken: {
        type: DataTypes.STRING(100),
        allowNull : true,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      role: {
        type: DataTypes.STRING(100),
        defaultValue: 'ROLE_USER',
      },
    },
    {
      timestamps: true,
    }
  );

  return User;
};
