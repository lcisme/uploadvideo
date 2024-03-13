const jwt = require("jsonwebtoken");
const db = require("../database/models");
const fileModel = db.File;
const { ROLE, JWT_SECRET, MAX_FILES_PER_USER } = require("../config/constant");
const jwtSecret = JWT_SECRET;
const { BaseResponse, ApplicationError } = require("../common/common");

const { File } = require("../database/models/file.model");

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
  if (parseInt(req.params.fileId) !== parseInt(req.userData.id)) {
    return BaseResponse.error(res, 403, "Unauthorized access");
  }
  return next();
};

const checkAuth = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return next(new ApplicationError(400, "Invalid token"));
  }
  const decodedToken = jwt.verify(token, jwtSecret);
  if (decodedToken.typeToken !== "ACCESS_TOKEN") {
    return next(new ApplicationError(400, "Invalid token"));
  }
  req.userData = decodedToken;
  return next();
};

const checkRoleAdmin = (req, res, next) => {
  if (!req.userData || req.userData?.role !== ROLE.ADMIN) {
    return BaseResponse.error(res, 403, "You not admin");
  }
  return next();
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

const checkRoleUser = (req, res, next) => {
  if (
    req.userData.role === ROLE.USER &&
    req.userData.id !== parseInt(req.params.userId)
  ) {
    return BaseResponse.error(res, 403, "Unauthorized access");
  }

  if (req.userData.role === ROLE.ADMIN || req.userData.role === ROLE.PREMIUM) {
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
    return next();
  };
}

module.exports = {
  can,
  checkAuth,
  checkRoleAdmin,
  checkRolePremium,
  checkRoleUser,
  checkRoleUserFile,
  checkRoleCreateUser,
  checkRoleListUser,
};
