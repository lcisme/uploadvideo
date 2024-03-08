const jwt = require("jsonwebtoken");
const { ROLE, JWT_SECRET } = require("../config/constant");
const jwtSecret = JWT_SECRET;

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
  return next();
};
const checkRoleUser = (req, res, next) => {
  if (!req.userData || req.userData.role !== ROLE.USER) {
    const e = new Error("You are not authorized");
    e.status = 403;
    return next(e);
  }

  if (req.userData.id !== parseInt(req.params.userId)) {
    const e = new Error("Unauthorized access");
    e.status = 403;
    return next(e);
  }

  return next();
};

module.exports = { checkAuth, checkRoleAdmin, checkRolePremium, checkRoleUser };
