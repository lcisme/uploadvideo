const userService = require("../services/userService");
const { validate, validateUpdate } = require("./validators/userValidator");
const {
  createToken,
  createRefreshToken,
  verifyToken
} = require("../authentication/jwt");
const userModel = require("../database/models/user.model");
const { BaseResponse, ApplicationError } = require("../common/common");
// const jwt = require("jsonwebtoken");

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
  });
  return BaseResponse.success(res, 200, "success", {
    accessToken: token,
    role: user.role,
    refreshToken: refreshToken,
  });
};

const refreshToken = async (req, res, next) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    throw new ApplicationError(400, "Refresh token is required");
  }
  try {
    const decoded = verifyToken(refreshToken);
    const { email, id, role } = decoded;
    const accessToken = await createToken({ email, id, role });
    return BaseResponse.success(res, 200, "success", { accessToken });
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
  refreshToken,
};
