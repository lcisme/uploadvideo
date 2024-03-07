const db = require('../database/models');
const User = db.User;

const createUser = async (userData) => {
  try {
    const duplicationCheck = await User.findOne({
      where: { email: userData.email },
    });
    if (duplicationCheck) {
      return null;
    }
    const newUser = await User.create(userData);
    return newUser;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

const verifyUser = async (userEmail) => {
  try {
    const user = await User.findOne({ where: { email: userEmail } });
    return user;
  } catch (error) {
    console.error("Error verifying user:", error);
    throw error;
  }
};

module.exports = {
  createUser,
  verifyUser,
};
