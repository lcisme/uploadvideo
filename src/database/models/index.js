const Sequelize = require("sequelize");
const { DATABASE_URL } = require("../../config/constant.js");

const sequelize = new Sequelize(DATABASE_URL);
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require("./user.model.js")(sequelize, Sequelize);
db.File = require("./file.model.js")(sequelize, Sequelize);

db.User.hasMany(db.File, { foreignKey: 'user_Id' });
db.File.belongsTo(db.User)
module.exports = db;