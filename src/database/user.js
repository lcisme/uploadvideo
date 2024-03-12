const db = require("../database/models");
const User = db.User;
const Sequelize = require("sequelize");
const { LIMIT } = require("../config/constant");

const createUser = async (userData) => {
  const duplicationCheck = await User.findOne({
    where: { email: userData.email },
  });
  if (duplicationCheck) {
    return null;
  }
  const newUser = await User.create(userData);
  return newUser;
};

const verifyUser = async (userEmail) => {
  const user = await User.findOne({ where: { email: userEmail } });
  return user;
};

const getAllUsers = async () => {
  const users = await User.findAll({attributes: { exclude: ['password'] }});
  return users;
};

const getUserById = async (userId) => {
  const user = await User.findOne({
    where: { id: userId },
    attributes: { exclude: ['password'] }
  });
    return user;
};

const updateUserById = async (userId, updateParams) => {
  try {
    const [, rowsUpdated] = await User.update(updateParams, {
      where: { id: userId },
    });

    if (rowsUpdated === 0) {
      throw new Error("Fail");
    }
    const updatedProduct = await User.findOne({ where: { id: userId } },{attributes: { exclude: ['password'] }});
    return updatedProduct;
  } catch (error) {
    throw error;
  }
};

const deleteUserById = async (userId) => {
  try {
    const deletedUser = await User.destroy({ where: { id: userId } });
    return deletedUser;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

const searchByName = async (q, orderType, page, limit, orderField,select) => {
  try {
    const OFFSET = (page - 1) * limit;
    const searchResult = await User.findAll({
      where: {
        [Sequelize.Op.or]: [
          { username: { [Sequelize.Op.like]: `%${q}%` } },
          { email: { [Sequelize.Op.like]: `%${q}%` } },
        ],
      },
      order: [[orderField, orderType]],
      limit: parseInt(limit),
      offset: OFFSET,
      attributes: select
    });
    return searchResult;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  createUser,
  verifyUser,
  searchByName,
};
