const jwt = require("jsonwebtoken");
const db = require("../database/models");
const fileModel = db.File;
const User = db.User;
const { ROLE, JWT_SECRET, MAX_FILES_PER_USER } = require("../config/constant");
const jwtSecret = JWT_SECRET;
const { BaseResponse, ApplicationError } = require("../common/common");

const checkRoleUserFile = async (req, res, next) => {
  const fileId = req.params.fileId;
  const file = await fileModel.findByPk(fileId);
  if (!file) {
    return BaseResponse.error(res, 403, "File not found");
  }

  if (req.userData.role === ROLE.USER && file.userId !== req.userData.id) {
    return BaseResponse.error(res, 403, "Unauthorized access");
  }

  // Kiểm tra role của người dùng và tiếp tục xử lý
  if (req.userData.role === ROLE.ADMIN || req.userData.role === ROLE.PREMIUM) {
    return next();
  }

  return next();
};

const checkRoleListUser = (req, res, next) => {
  if (req.userData.role === ROLE.ADMIN) {
    return next();
  }
  if (parseInt(req.params.fileId) !== parseInt(req.userData.id)) {
    return BaseResponse.error(res, 403, "Unauthorized access");
  }
  return next();
};

const checkAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return next(new ApplicationError(400, "Invalid token"));
    }
    const decodedToken = jwt.verify(token, jwtSecret);
    if (decodedToken.typeToken !== "ACCESS_TOKEN") {
      return next(new ApplicationError(400, "Invalid token"));
    }
    const user = await User.findOne({
      where: { id: decodedToken.id, hashToken: decodedToken.hashToken },
    });
    if (!user) {
      return next(new ApplicationError(400, "Not found  user"));
    }
    req.userData = decodedToken;
    return next();
  } catch (error) {
    return next(new ApplicationError(500, "Token is timeout"));
  }
};


const checkRolePremium = (req, res, next) => {
  if (req.userData && req.userData.role !== ROLE.PREMIUM) {
    return BaseResponse.error(res, 403, "You not premium");
  }

  if (req.userData.role === ROLE.ADMIN) {
    return next();
  }

  return next();
};

const checkRoleCreateUser = async (req, res, next) => {
  if (req.userData.role === ROLE.USER) {
    const filesUploadedByUserCount = await fileModel.findAll({
      where: { userId: req.userData.id },
    });
    const turn = filesUploadedByUserCount.length;
    console.log(MAX_FILES_PER_USER);
    if (turn >= MAX_FILES_PER_USER) {
      return BaseResponse.error(
        res,
        403,
        `You have reached the maximum limit of ${MAX_FILES_PER_USER} files.`
      );
    }
  }
  return next();
};

const can = (...roleName) => {
  return (req, res, next) => {
    if (!req.userData) {
      return BaseResponse.error(res, 403, "Permission denied.");
    }
    const roleOfUser = req.userData.role;
    if (!roleName.includes(roleOfUser)) {
      return BaseResponse.error(res, 403, "Permission denied.");
    }
    if (
      roleName.includes(ROLE.USER) && req.params.userId && req.userData.id !== parseInt(req.params.userId)
    ) {
      return BaseResponse.error(res, 403, "Unauthorized access");
    }
    return next();
  };
};

const validateParams = (schemaValidate) => {
  return async (req, res, next) => {
    console.log(req.params);
    console.log(req.body);
    console.log(req.query);
    if (!req.params && !req.body && !req.query) {
      return BaseResponse.error(res, 400, "No params or body found.");
    }
    try {
      if (req.params) {
        await schemaValidate(req.params);
      }

      if (req.body) {
        await schemaValidate(req.body);
      }

      if (req.query) {
        await schemaValidate(req.query);
      }
      return next();
    } catch (error) {
      console.log(error);
      return BaseResponse.error(res, 400, "Validation failed.", error);
    }
  };
};
module.exports = {
  can,
  validateParams,
  checkAuth,
  checkRolePremium,
  checkRoleUserFile,
  checkRoleCreateUser,
  checkRoleListUser,
};
