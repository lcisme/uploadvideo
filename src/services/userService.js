const User = require("../database/user");
const bcrypt = require("bcrypt");
const {
  createToken,
  createRefreshToken,
  verifyRefreshToken,
} = require("../authentication/jwt");
const { BaseResponse, ApplicationError } = require("../common/common");
const jwt = require("jsonwebtoken");
const { JWT_REFRESH_SECRET } = require("../config/constant");
const jwtRefreshSecret = JWT_REFRESH_SECRET;

const createUser = async (userData) => {
  const newHashToken = Math.random();
  userData.hashToken = newHashToken;
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  userData.password = hashedPassword;
  return User.createUser(userData);
};

const loginUser = async (userData) => {
  const user = await User.loginUser(userData);

  if (!user) {
    throw new ApplicationError(400, "Wrong email or password");
  }

  const token = await createToken({
    email: user.email,
    id: user.id,
    role: user.role,
    typeToken: "ACCESS_TOKEN",
    hashToken: user.hashToken,
  });

  const refreshToken = await createRefreshToken({
    email: user.email,
    id: user.id,
    role: user.role,
    typeToken: "REFRESH_TOKEN",
    hashToken: user.hashToken,
  });

  return { accessToken: token, role: user.role, refreshToken: refreshToken };
};

const logoutUser = async (userId) => {
  const logout = await User.logoutUser(userId);
  return logout;
};

const refreshTokenHandler = async (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, jwtRefreshSecret);
    if (!decoded.typeToken) {
      throw new ApplicationError(400, "This is not a Refresh Token");
    }

    const decodedRefreshToken = verifyRefreshToken(refreshToken);
    const { email, id, role, typeToken, hashToken } = decodedRefreshToken;

    const accessToken = await createToken({
      email,
      id,
      role,
      typeToken,
      hashToken,
    });
    const refreshNewToken = await createRefreshToken({
      email,
      id,
      role,
      typeToken,
      hashToken,
    });

    return {
      accessToken: accessToken,
      refreshToken: refreshNewToken,
    };
  } catch (error) {
    throw new ApplicationError(500, error.message);
  }
};

const searchByName = async (q, orderType, page, limit, orderField, select) => {
  return User.searchByName(q, orderType, page, limit, orderField, select);
};
const getUserById = async (userId) => {
  return User.getUserById(userId);
};
const updateUserById = async (userId, updateParams) => {
  try {
    if (updateParams.password) {
      const hashedPassword = await bcrypt.hash(updateParams.password, 10);
      updateParams.password = hashedPassword;
    }
    const updatedUser = await User.updateUserById(userId, updateParams);
    return updatedUser;
  } catch (error) {
    throw new ApplicationError(500, error.message);
  }
};

const deleteUserById = async (userId) => {
  return User.deleteUserById(userId);
};


module.exports = {
  createUser,
  loginUser,
  logoutUser,
  refreshTokenHandler,
  searchByName,
  getUserById,
  updateUserById,
  deleteUserById,
};
