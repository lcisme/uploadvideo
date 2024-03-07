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
  return BaseResponse.success(res, 200, "ok", { user });
};

const verifyUser = async (req, res, next) => {
  const userData = req.body;

  try {
    await validate(userData);
  } catch (error) {
    const e = new Error("Wrong email or password");
    e.status = 400;
    return next(e);
  }

  try {
    const { dataValues: user } = await userService.verifyUser(userData);
    if (user) {
      try {
        const token = await createToken({
          email: user.email,
          id: user.id,
          role: user.role,
        });

        return BaseResponse.success(res, 200, "success", token);
      } catch (error) {
        throw error;
      }
    } else {
      throw new ApplicationError(400, "Wrong email or password");
    }
  } catch (error) {
    return next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    if (!users) {
      const e = new Error("users not found");
      e.status = 400;
      return next(e);
    }
    return BaseResponse.success(res, 200, "success", { users });
  } catch (error) {
    const e = new Error("Cannot get all users");
    return next(e);
  }
};

const getUserById = async (req, res, next) => {
  const id = req.params.userId;
  try {
    const user = await userService.getUserById(id);
    if (!user) {
      const e = new Error("user not found");
      e.status = 404;
      return next(e);
    }
    return BaseResponse.success(res, 200, "success", { user });
  } catch (error) {
    const e = new Error("Cannot get user");
    return next(e);
  }
};

const updateUserById = async (req, res, next) => {
  const id = req.params.userId;
  const updateParams = req.body;
  try {
    await validateUpdate(updateParams);
  } catch (error) {
    const e = new Error("Invalid user data");
    return next(e);
  }

  try {
    const user = await userService.updateUserById(id, updateParams);
    if (!user) {
      const e = new Error("user not found");
      e.status = 404;
      return next(e);
    }
    return BaseResponse.success(res, 200, "success", { user });
  } catch (error) {
    console.error("Error updating user:", error);
    const e = new Error("Cannot update user");
    return next(e);
  }
};

const deleteUserById = async (req, res, next) => {
  const id = req.params.userId;
  try {
    const user = await userService.deleteUserById(id);
    if (!user) {
      const e = new Error("user not found");
      e.status = 404;
      return next(e);
    }
    return BaseResponse.success(res, 200, "success");
  } catch (error) {
    const e = new Error("Cannot delete user");
    return next(e);
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
