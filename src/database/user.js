const db = require("../database/models");
const User = db.User;
const Sequelize = require("sequelize");
const bcrypt = require("bcrypt");

const createUser = async (userData) => {
  const duplicationCheck = await User.findOne({
    where: { email: userData.email },
    attributes: { exclude: ["password"] },
  });
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  userData.password = hashedPassword;
  if (duplicationCheck) {
    return null;
  }
  const newUser = await User.create(userData);
  if (!newUser) {
    return null;
  }
  return newUser;
};

const verifyUser = async (userData) => {
  const user = await User.findOne({ where: { email: userData.email } });
  const isPasswordCorrect = await bcrypt.compare(
    userData.password,
    user.password
  );
  if (!user) {
    return null;
  }
  if (!isPasswordCorrect) {
    return null;
  }
  return user;
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
    if (updateParams.password) {
      const hashedPassword = await bcrypt.hash(updateParams.password, 10);
      updateParams.password = hashedPassword;
    }
    const [, rowsUpdated] = await User.update(updateParams, {
      where: { id: userId },
    });
    if (rowsUpdated === 0) {
      throw new Error("Fail");
    }
    const updatedProduct = await User.findOne(
      { where: { id: userId } },
      { attributes: { exclude: ["password"] } }
    );
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

module.exports = {
  getUserById,
  updateUserById,
  deleteUserById,
  createUser,
  verifyUser,
  searchByName,
};
