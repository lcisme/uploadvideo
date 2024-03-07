const User  = require("../database/user");
const bcrypt = require("bcrypt");

const createUser = async (userData) => {
  try {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    userData.password = hashedPassword;
    const newUser = await User.createUser(userData);
    return newUser;
  } catch (error) {
    throw new Error("Error creating user");
  }
};

const verifyUser = async (userData) => {
  try {
    const user = await User.findOne({ where: { email: userData.email } });
    if (user) {
      const isPasswordCorrect = await bcrypt.compare(
        userData.password,
        user.password
      );
      return isPasswordCorrect;
    }
    return false;
  } catch (error) {
    throw new Error("Error verifying user");
  }
};

module.exports = {
  createUser,
  verifyUser,
};
