const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

const checkAuth = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, jwtSecret);
        return next();
    } catch (error) {
        const e = new Error('Invalid token');
        e.status = 401;
        return next(e);
    }
};

module.exports = checkAuth;
