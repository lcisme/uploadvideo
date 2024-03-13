const userService = require("../services/userService");
const { validate, validateUpdate } = require("./validators/userValidator");
const {
  createToken,
  createRefreshToken,
  verifyToken,
  verifyRefreshToken,
} = require("../authentication/jwt");
const userModel = require("../database/models/user.model");
const { BaseResponse, ApplicationError } = require("../common/common");
const jwt = require("jsonwebtoken");
const { JWT_REFRESH_SECRET } = require("../config/constant");
const jwtRefreshSecret = JWT_REFRESH_SECRET;
const redis = require('redis');
const JWTR = require('jwt-redis').default;
const redisClient = redis.createClient();
const jwtr = new JWTR(redisClient);

const createUser = async (req, res, next) => {
  const userData = req.body;
  try {
    await validate(userData);
  } catch (error) {
    return BaseResponse.error(res, 400, "Invalid email or password");
  }
  const user = await userService.createUser(userData);
  if (!user) {
    return BaseResponse.error(res, 400, "User already exists");
  }
  return BaseResponse.success(res, 200, "ok", user);
};

const verifyUser = async (req, res, next) => {
  const userData = req.body;
  await validate(userData);
  const { dataValues: user } = await userService.verifyUser(userData);
  if (!user) {
    throw new ApplicationError(400, "Wrong email or password");
  }
  const token = await createToken({
    email: user.email,
    id: user.id,
    role: user.role,
  });

  const refreshToken = await createRefreshToken({
    email: user.email,
    id: user.id,
    role: user.role,
    typeToken: user.typeToken,
  });
  return BaseResponse.success(res, 200, "success", {
    accessToken: token,
    role: user.role,
    refreshToken: refreshToken,
  });
};

const logoutUser = async (req, res) => {
  
  // req.body.accessToken  += mmahoa
  try {
    const token = req.headers.authorization;
    if (!token) {
      throw new ApplicationError(400, "Token is missing");
    }

    await jwtr.destroy(token);

    return BaseResponse.success(res, 200, "Logout successful");
  } catch (error) {
    console.error('Error during logout:', error);
    return BaseResponse.error(res, 500, "Internal server error");
  }
};


const refreshTokenHandler = async (req, res, next) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return next(new ApplicationError(400, "Refresh token is required"));
  }
  const decodedRefreshToken = jwt.verify(refreshToken, jwtRefreshSecret);
  console.log(decodedRefreshToken);
  if (!decodedRefreshToken.typeToken) {
    return next(new ApplicationError(400, "This is not Refresh Token"));
  }
  try {
    const decoded = verifyRefreshToken(refreshToken);
    const { email, id, role, typeToken } = decoded;
    const accessToken = await createToken({ email, id, role });
    console.log(accessToken + "hhuhu");
    const refreshNewToken = await createRefreshToken({
      email,
      id,
      role,
      typeToken,
    });
    return BaseResponse.success(res, 200, "success", {
      accessToken: accessToken,
      refreshToken: refreshNewToken,
    });
  } catch (error) {
    return next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    if (!users) {
      throw new ApplicationError(400, "users not found");
    }
    return BaseResponse.success(res, 200, "success", users);
  } catch (error) {
    return next(error);
  }
};

// const getUserById = async (req, res, next) => {
//   const id = req.params.userId;

//   const user = await userService.getUserById(id);
//   if (!user) {
//     throw new ApplicationError(404, "user not found");
//   }
//   return BaseResponse.success(res, 200, "success", user);
// };

const getUserById = async (req, res, next) => {
  const id = req.params.userId;
  try {
    const user = await userService.getUserById(id);
    if (!user) {
      throw new ApplicationError(404, "user not found");
    }
    return BaseResponse.success(res, 200, "success", user);
  } catch (error) {
    return next(error);
  }
};

const updateUserById = async (req, res, next) => {
  const id = req.params.userId;
  const updateParams = req.body;
  try {
    await validateUpdate(updateParams);
  } catch (error) {
    return BaseResponse.error(res, 400, "Invalid user data");
  }

  try {
    const user = await userService.updateUserById(id, updateParams);
    if (!user) {
      return BaseResponse.error(res, 404, "user not found");
    }
    return BaseResponse.success(res, 200, "success", { user });
  } catch (error) {
    return next(error);
  }
};

const deleteUserById = async (req, res, next) => {
  const id = req.params.userId;
  const user = await userService.deleteUserById(id);
  try {
    if (!user) {
      throw new ApplicationError(404, "user not found");
    }
    return BaseResponse.success(res, 200, "success");
  } catch (error) {
    return next(error);
  }
};

const searchByName = async (req, res, next) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const q = req.query.q;
  const orderType = (req.query.orderType || "asc").toLowerCase();
  const orderField = req.query.orderField || "username";
  let select = req.query.select || "username";
  const user = await userService.searchByName(
    q,
    orderType,
    page,
    limit,
    orderField,
    select
  );
  if (!user) {
    throw new ApplicationError(400, "username not found");
  }
  return BaseResponse.success(res, 200, "success", user);
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  createUser,
  verifyUser,
  searchByName,
  refreshTokenHandler,
  logoutUser
};
