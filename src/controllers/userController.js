const userService = require("../services/userService");
const { validate, validateUpdate } = require("./validators/userValidator");
const { createToken, checkUserRole } = require("../authentication/jwt");
const userModel = require("../database/models/user.model");

class ApplicationError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

class BaseResponse {
  constructor() {
    this.statusCode = 200;
    this.message = "success";
    this.data = {};
    this.error = null;
  }

  static success(res, statusCode, message, data) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    return res.status(this.statusCode).json({
      message: this.message,
      data: this.data,
    });
  }

  static error(statusCode, message, error) {
    this.statusCode = statusCode;
    this.message = message;
    this.error = error;
  }
}

const createUser = async (req, res, next) => {
  const userData = req.body;
  try {
    await validate(userData);
  } catch (error) {
    const e = new Error("Invalid email or password");
    e.status = 400;
    return next(e);
  }
  const user = await userService.createUser(userData);
  if (!user) {
    const error = new Error("User already exists");
    error.status = 400;
    return next(error);
  }
  return BaseResponse.success(res, 200, "ok", user);
};

const verifyUser = async (req, res, next) => {
  const userData = req.body;

  try {
    await validate(userData);

    const { dataValues: user } = await userService.verifyUser(userData);
    if (user) {
      const token = await createToken({
        email: user.email,
        id: user.id,
        role: user.role,
      });

      return BaseResponse.success(res, 200, "success", {
        accessToken: token,
        role: user.role,
      });
    } else {
      const e = new Error("Wrong email or password");
      e.status = 400;
      throw e;
    }
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
    return next(new ApplicationError(500, "Cannot get all users"));
  }
};

const getUserById = async (req, res, next) => {
  const id = req.params.userId;
  try {
    const user = await userService.getUserById(id);
    if (!user) {
      throw new ApplicationError(404, "user not found");
    }
    return BaseResponse.success(res, 200, "success", user);
  } catch (error) {
    return next(new ApplicationError(500, "Cannot get user"));
  }
};

const updateUserById = async (req, res, next) => {
  const id = req.params.userId;
  const updateParams = req.body;
  try {
    await validateUpdate(updateParams);
  } catch (error) {
    return next(new ApplicationError(400, "Invalid user data"));
  }

  try {
    const user = await userService.updateUserById(id, updateParams);
    if (!user) {
      throw new ApplicationError(404, "user not found");
    }
    return BaseResponse.success(res, 200, "success", { user });
  } catch (error) {
    return next(new ApplicationError(500, "Cannot update user"));
  }
};

const deleteUserById = async (req, res, next) => {
  const id = req.params.userId;
  try {
    const user = await userService.deleteUserById(id);
    if (!user) {
      throw new ApplicationError(404, "user not found");
    }
    return BaseResponse.success(res, 200, "success");
  } catch (error) {
    return next(new ApplicationError(500, "Cannot delete user"));
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  createUser,
  verifyUser,
};
