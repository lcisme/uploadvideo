const userService = require("../services/userService");
const { BaseResponse, ApplicationError } = require("../common/common");

const paginateResults = require("../middleware/pagination");

const createUser = async (req, res, next) => {
  const userData = req.body;
  try {
    const user = await userService.createUser(userData);
    if (!user) {
      return BaseResponse.error(res, 400, "User already exists");
    }
    return BaseResponse.success(res, 200, "ok", user);
  } catch (error) {
    return next(new ApplicationError(500, error));
  }
};

const loginUser = async (req, res, next) => {
  const userData = req.body;
  try {
    const userTokenData = await userService.loginUser(userData);
    return BaseResponse.success(res, 200, "success", userTokenData);
  } catch (error) {
    return next(new ApplicationError(500, error));
  }
};

const logoutUser = async (req, res, next) => {
  const userId = req.userData.id;
  try {
    const logout = await userService.logoutUser(userId);

    if (!logout) {
      return next(new ApplicationError(400, "User not found"));
    }
    return BaseResponse.success(res, 200, "success", {
      message: "Logout successful",
    });
  } catch (error) {
    return next(new ApplicationError(500, error));
  }
};

const refreshTokenHandler = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw new ApplicationError(400, "Refresh token is required");
    }
    const tokens = await userService.refreshTokenHandler(refreshToken);
    return BaseResponse.success(
      res,
      200,
      "Tokens refreshed successfully",
      tokens
    );
  } catch (error) {
    return next(error);
  }
};

const searchByName = async (req, res, next) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const q = req.query.q || "";
    const orderType = (req.query.orderType || "asc").toLowerCase();
    const orderField = req.query.orderField || "username";
    let select = req.query.select || ["username", "email"];
    if (typeof select === "string") {
      select = [select];
    }
    const { user, totalCount } = await userService.searchByName(
      q,
      orderType,
      page,
      limit,
      orderField,
      select
    );

    const results = paginateResults(totalCount, limit, page, user);
    return BaseResponse.success(res, 200, "success", { user, results });
  } catch (error) {
    return next(new ApplicationError(500, error));
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
    return next(new ApplicationError(500, error));
  }
};

const updateUserById = async (req, res, next) => {
  const id = req.params.userId;
  const updateParams = req.body;
  try {
    const user = await userService.updateUserById(id, updateParams);
    if (!user) {
      return BaseResponse.error(res, 404, "user not found");
    }
    return BaseResponse.success(res, 200, "success", { user });
  } catch (error) {
    return next(new ApplicationError(500, error));
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
    return next(new ApplicationError(500, error));
  }
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

