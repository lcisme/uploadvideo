const db = require("../database/models");
const User = db.User;
const Sequelize = require("sequelize");
const bcrypt = require("bcrypt");

const createUser = async (userData) => {
  const duplicationCheck = await User.findOne({
    where: { email: userData.email },
    attributes: { exclude: ["password"] },
  });
  if (duplicationCheck) {
    return null;
  }
  const newUser = await User.create(userData);
  if (!newUser) {
    return null;
  }
  return newUser;
};

const loginUser = async (userData) => {
  const user = await User.findOne({ where: { email: userData.email } });
  if (!user) {
    return null;
  }
  const isPasswordCorrect = await bcrypt.compare(
    userData.password,
    user.password
  );
  if (!isPasswordCorrect) {
    return null;
  }
  return user;
};

const logoutUser = async (userId) => {
  const newHashToken = Math.random();
  const [, rowsUpdated] = await User.update(
    { hashToken: newHashToken },
    { where: { id: userId } }
  );

  if (rowsUpdated === 0) {
    throw new Error("Fail");
  }

  return true; 
};
const searchByName = async (q, orderType, page, limit, orderFiled, select) => {
  try {
    const OFFSET = (page - 1) * limit;
    const totalCount = await User.count({
      where: {
        [Sequelize.Op.or]: [
          { username: { [Sequelize.Op.like]: `%${q}%` } },
          { email: { [Sequelize.Op.like]: `%${q}%` } },
        ],
      },
    });
    const a = {
      order: [[orderFiled, orderType]],
      limit: parseInt(limit),
      offset: OFFSET,
      attributes: select,
    };
    if (q) {
      a["where"] = {
        [Sequelize.Op.or]: [
          { username: { [Sequelize.Op.like]: `%${q}%` } },
          { email: { [Sequelize.Op.like]: `%${q}%` } },
        ],
      };
    }
    const user = await User.findAll(a);
    return { user, totalCount };
  } catch (error) {
    throw error;
  }
};

const getUserById = async (userId) => {
  const user = await User.findOne({
    where: { id: userId },
    attributes: { exclude: ["password"] },
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
    const updatedUser = await User.findOne(
      { where: { id: userId } },
      { attributes: { exclude: ["password"] } }
    );
    return updatedUser;
  } catch (error) {
    throw error;
  }
};

const deleteUserById = async (userId) => {
  try {
    const deletedUser = await User.destroy({ where: { id: userId } });
    return deletedUser;
  } catch (error) {
    throw error;
  }
};



module.exports = {
  createUser,
  loginUser,
  logoutUser,
  searchByName,
  getUserById,
  updateUserById,
  deleteUserById,
};

