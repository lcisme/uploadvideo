const User = require("../database/user");
const bcrypt = require("bcrypt");
const db = require("../database/models");
const UserLogin = db.User;

const createUser = async (userData) => {
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  userData.password = hashedPassword;
  const newUser = await User.createUser(userData);
  if (!newUser) {
    return null;
  }
  return newUser;
};

const verifyUser = async (userData) => {
  const user = await UserLogin.findOne({ where: { email: userData.email } });
  console.log(user);
  if (!user) {
    return null;
  }
  const isPasswordCorrect = await bcrypt.compare(
    userData.password,
    user.password
  );
  if (isPasswordCorrect) {
    return user;
  }
};

const getAllUsers = () => {
  return User.getAllUsers();
};

const getUserById = async (userId) => {
  return User.getUserById(userId);
};
const updateUserById = async (userId, updateParams) => {
  if (updateParams.password) {
    const hashedPassword = await bcrypt.hash(updateParams.password, 10);
    updateParams.password = hashedPassword;
  }
  return User.updateUserById(userId, updateParams);
};

const deleteUserById = async (userId) => {
  return User.deleteUserById(userId);
};

const searchByName = async (q, orderType, page, limit, orderField,select) => {
  return User.searchByName(q, orderType, page, limit, orderField, select);
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
