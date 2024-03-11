const userService = require("../services/userService");
const { validate, validateUpdate } = require("./validators/userValidator");
const { createToken, checkUserRole } = require("../authentication/jwt");
const userModel = require("../database/models/user.model");
const { BaseResponse } = require("../common/common");

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
  try {
    await validate(userData);
    const { dataValues: user } = await userService.verifyUser(userData);
    if (!user) {
      return BaseResponse.error(res, 400, "Wrong email or password");
    }
    const token = await createToken({
      email: user.email,
      id: user.id,
      role: user.role,
    });
    return BaseResponse.success(res, 200, "success", {
      accessToken: token,
      role: user.role,
    });
  } catch (error) {
    return next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  const page = req.query.page || 1;
  try {
    const users = await userService.getAllUsers(page);
    if (!users) {
      return BaseResponse.error(res, 400, "users not found");
    }
    return BaseResponse.success(res, 200, "success", users);
  } catch (error) {
    return next(error);
  }
};

const getUserById = async (req, res, next) => {
  const id = req.params.userId;
  try {
    const user = await userService.getUserById(id);
    if (!user) {
      return BaseResponse.error(res, 404, "user not found");
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
  try {
    const user = await userService.deleteUserById(id);
    if (!user) {
      return BaseResponse.error(res, 404, "user not found");
    }
    return BaseResponse.success(res, 200, "success");
  } catch (error) {
    return next(error);
  }
};

const searchByName = async (req, res, next) => {
  const name = req.params.userName;
  const sortOrder = (req.query.sortOrder || "asc").toLowerCase();
  console.log(sortOrder);
  try {
    const user = await userService.searchByName(name, sortOrder);
    if (!user) {
      return BaseResponse.error(res, 400, "username not found");
    }
    return BaseResponse.success(res, 200, "success", user);
  } catch (error) {
    return next(error);
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
