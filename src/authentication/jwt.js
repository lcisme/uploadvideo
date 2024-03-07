const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;
const jwtTokenExpire = process.env.JWT_TOKEN_EXPIRE;

const createToken = async (data) => {
  console.log(data);
  return new Promise((resolve, reject) => {
    jwt.sign(data, jwtSecret, { expiresIn: jwtTokenExpire }, (err, token) => {
      if (err) {
        console.log(err);
        reject(new Error("Error creating token"));
      } else {
        resolve(token);
      }
    });
  });
};

module.exports = {
  createToken,
};
