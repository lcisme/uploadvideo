module.exports = (sequelize, Sequelize) => {
  const File = sequelize.define(
    "files",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nameFile: {
        type: Sequelize.TEXT("long"),
        allowNull: false,
      },
      status: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      user_Id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: true,
    }
  );

  return File;
};
