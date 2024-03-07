const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

const checkAuth = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, jwtSecret);
        req.userData = decodedToken
        return next();
    } catch (error) {
        const e = new Error('Invalid token');
        e.status = 401;
        return next(e);
    }
};
const checkUserRole = (req, res, next) => {
  if (req.userData && req.userData.role === 'ROLE_ADMIN') {
    return next()
  } else {
    const e = new Error('You not admin');
    console.log(req.userData)
    e.status = 403;
    return next(e);
  }
}
module.exports = {checkAuth,
checkUserRole};
