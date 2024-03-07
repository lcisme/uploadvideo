const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
  const File = sequelize.define('files', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nameFile: {
      type: DataTypes.TEXT('long'),
      allowNull: true,
      charset: 'utf8mb4',
      collate: 'utf8mb4_0900_ai_ci'
    },
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    createdAt: {
      field: 'created_At',
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      field: 'updated_At',
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'files', 
    timestamps: false 
  });

  return File;
};
