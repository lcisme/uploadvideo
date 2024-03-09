const jwt = require("jsonwebtoken");
const db = require("../database/models");
const fileModel = db.File;
const { ROLE, JWT_SECRET } = require("../config/constant");
const jwtSecret = JWT_SECRET;

const { File } = require("../database/models/file.model");

const checkRoleUserFile = async (req, res, next) => {
  const fileId = req.params.fileId;
  const file = await fileModel.findByPk(fileId);
  if (!file) {
    const e = new Error("File not found");
    e.status = 404;
    return next(e);
  }

  if (req.userData.role === ROLE.USER && file.user_Id !== req.userData.id) {
    const e = new Error("Unauthorized access");
    e.status = 403;
    return next(e);
  }

  // Kiểm tra role của người dùng và tiếp tục xử lý
  if (req.userData.role === ROLE.ADMIN || req.userData.role === ROLE.PREMIUM) {
    return next();
  }

  return next();
};

const checkAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, jwtSecret);
    req.userData = decodedToken;
    return next();
  } catch (error) {
    const e = new Error("Invalid token");
    e.status = 401;
    return next(e);
  }
};
const checkRoleAdmin = (req, res, next) => {
  if (!req.userData && req.userData.role !== ROLE.ADMIN) {
    const e = new Error("You not admin");
    e.status = 403;
    return next(e);
  }
  return next();
};

const checkRolePremium = (req, res, next) => {
  if (!req.userData && req.userData.role !== ROLE.PREMIUM) {
    const e = new Error("You not premium");
    e.status = 403;
    return next(e);
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
    const e = new Error("Unauthorized access");
    e.status = 403;
    return next(e);
  }

  if (req.userData.role === ROLE.ADMIN || req.userData.role === ROLE.PREMIUM) {
    return next();
  }

  return next();
};
module.exports = {
  checkAuth,
  checkRoleAdmin,
  checkRolePremium,
  checkRoleUser,
  checkRoleUserFile,
};
