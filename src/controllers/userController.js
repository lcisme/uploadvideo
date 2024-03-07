const userService = require("../services/userService");
const { validate } = require("./validators/userValidator");
const { createToken } = require("../authentication/jwt");

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

// DTO
const createUser = async (req, res, next) => {
  const userData = req.body;
  try {
    await validate(userData);
  } catch (error) {
    const e = new Error("Invalid email or password");
    e.status = 400;
    return next(e);
  }

  try {
    const user = await userService.createUser(userData);
    if (user) {
      return BaseResponse.success(res, 200, "ok", { user });
    } else {
      const error = new Error("User already exists");
      error.status = 400;
      return next(error);
    }
  } catch (error) {
    const e = new Error("Cannot create user");
    console.log(error);
    return next(e);
  }
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
    const user = await userService.verifyUser(userData);
    if (user) {
      try {
        const token = await createToken({
          email: userData.email,
          id: user._id,
        });
        res.status(200).json({
          status: "success",
          token: token,
        });
      } catch (error) {
        // console.log(error);
        throw error;
        // const e = new Error("Cannot create token");
        // return next(e);
      }
    } else {
      // const e = new Error("Wrong email or password");
      // e.status = 400;
      throw new ApplicationError(400, "Wrong email or password");
      // return next(e);
    }
  } catch (error) {
    // const e = new Error("Cannot verify user");
    return next(e);
  }
};

module.exports = {
  createUser,
  verifyUser,
};
