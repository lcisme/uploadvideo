const userService = require("../services/userService");
const {
  createToken,
  createRefreshToken,
  verifyRefreshToken,
} = require("../authentication/jwt");
const { BaseResponse, ApplicationError } = require("../common/common");
const jwt = require("jsonwebtoken");
const { JWT_REFRESH_SECRET } = require("../config/constant");
const jwtRefreshSecret = JWT_REFRESH_SECRET;
const db = require("../database/models");
const User = db.User;
const Sequelize = require("sequelize");

const createUser = async (req, res, next) => {
  const userData = req.body;
  try {
    const newHashToken = Math.random();
    userData.hashToken = newHashToken;
    const user = await userService.createUser(userData);
    if (!user) {
      return BaseResponse.error(res, 400, "User already exists");
    }
    return BaseResponse.success(res, 200, "ok", user);
  } catch (error) {
    return next(new ApplicationError(500, error));
  }
};

const verifyUser = async (req, res, next) => {
  const userData = req.body;
  try {
    const { dataValues: user } = await userService.verifyUser(userData);
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
    return BaseResponse.success(res, 200, "success", {
      accessToken: token,
      role: user.role,
      refreshToken: refreshToken,
    });
  } catch (error) {
    return next(new ApplicationError(500, error));
  }
};

const logoutUser = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return next(new ApplicationError(400, "logout fail"));
  }
  const newHashToken = Math.random();
  try {
    const [, rowsUpdated] = await User.update(
      { hashToken: newHashToken },
      { where: { id: req.userData.id } }
    );
    if (rowsUpdated === 0) {
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
    const { email, id, role, typeToken, hashToken } = decoded;
    const accessToken = await createToken({ email, id, role, hashToken });
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
    return next(new ApplicationError(500, error));
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
    const user = await userService.searchByName(
      q,
      orderType,
      page,
      limit,
      orderField,
      select
    );
    const totalCount = await User.count({
      where: {
        [Sequelize.Op.or]: [
          { username: { [Sequelize.Op.like]: `%${q}%` } },
          { email: { [Sequelize.Op.like]: `%${q}%` } },
        ],
      },
    });
    const totalPages = Math.ceil(totalCount / limit);
    const hasBackPage = !(parseInt(page) === 1 || totalCount === 0);
    const countUser = user.length;
    const totalQueriesUsers = (page - 1) * limit + countUser;
    const totalUsers = totalCount;
    const isLastPage = totalQueriesUsers >= totalUsers;
    const hasNextPage = !(countUser < parseInt(limit)) && !isLastPage;

    console.log(hasNextPage);
    const results = {
      pagination: {
        total: totalCount,
        totalPages: totalPages,
        hasNextPage: hasNextPage,
        hasBackPage: hasBackPage,
        nextPage: hasNextPage ? parseInt(page) + 1 : "Cannot next",
        backpage: hasBackPage ? parseInt(page) - 1 : "Cannot back",
      },
    };

    res.paginatedResults = results;
    return BaseResponse.success(res, 200, "success", { user, results });
  } catch (error) {
    return next(new ApplicationError(500, error));
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
  refreshTokenHandler,
  logoutUser,
};
