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

const getAllUsers = async (page) => {
  const OFFSET = (page - 1) * LIMIT;
  const users = await User.findAll({
    limit: LIMIT,
    offset: OFFSET,
  });
  return users;
};

const getUserById = async (userId) => {
  const user = await User.findOne({ where: { id: userId } });
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
    const updatedProduct = await User.findOne({ where: { id: userId } });
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

const searchByName = async (userName, sortOrder) => {
  try {
    let orderCriteria = [["username", "ASC"]];

    if (sortOrder === "desc") {
      orderCriteria = [["username", "DESC"]];
    }

    const searchByName = await User.findAll({
      where: {
        username: {
          [Sequelize.Op.like]: `%${userName}%`,
        },
      },
      order: orderCriteria,
    });
    return searchByName;
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
