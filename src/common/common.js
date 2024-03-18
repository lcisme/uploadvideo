const db = require("../database/models");

class ApplicationError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

class BaseResponse {
  static success(res, statusCode, message, data) {
    return res.status(statusCode).json({
      message: message,
      data: data,
    });
  }

  static error(res, statusCode, message, error) {
    return res.status(statusCode).json({
      message: message,
      error: error,
    });
  }
}

module.exports = {
  BaseResponse,
  ApplicationError,
};
