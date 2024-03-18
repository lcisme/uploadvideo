const User = require("../database/user");

const createUser = async (userData) => {
  return User.createUser(userData);
};

const verifyUser = async (userData) => {
  return User.verifyUser(userData)
};

const getUserById = async (userId) => {
  return User.getUserById(userId);
};
const updateUserById = async (userId, updateParams) => {
  return User.updateUserById(userId, updateParams);
};

const deleteUserById = async (userId) => {
  return User.deleteUserById(userId);
};

const searchByName = async (q, orderType, page, limit, orderField, select) => {
  return User.searchByName(q, orderType, page, limit, orderField, select);
};
module.exports = {
  getUserById,
  updateUserById,
  deleteUserById,
  createUser,
  verifyUser,
  searchByName,
};
