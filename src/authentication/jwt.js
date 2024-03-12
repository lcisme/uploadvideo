const jwt = require("jsonwebtoken");
const {
  JWT_TOKEN_EXPIRE,
  JWT_SECRET,
  JWT_REFRESH_SECRET,
  JWT_REFRESH_TOKEN,
} = require("../config/constant");
const jwtSecret = JWT_SECRET;
const jwtRefreshSecret = JWT_REFRESH_SECRET;
const jwtTokenExpire = JWT_TOKEN_EXPIRE;
const jwtRefreshTokenExpire = JWT_REFRESH_TOKEN;

const createToken = async (data) => {
  console.log(data);
  return new Promise((resolve, reject) => {
    jwt.sign(data, jwtSecret, { expiresIn: jwtTokenExpire }, (err, token) => {
      if (err) {
        console.log(err);
        reject(new Error("Error creating access token"));
      } else {
        resolve(token);
      }
    });
  });
};

const createRefreshToken = async (data) => {
  console.log(data);
  return new Promise((resolve, reject) => {
    jwt.sign(
      data,
      jwtRefreshSecret,
      { expiresIn: jwtRefreshTokenExpire },
      (err, token) => {
        if (err) {
          console.log(err);
          reject(new Error("Error creating refresh token"));
        } else {
          resolve(token);
        }
      }
    );
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, jwtSecret);
};

module.exports = {
  createToken,
  createRefreshToken,
  verifyToken,
};
