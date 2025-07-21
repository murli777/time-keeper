const jwt = require("jsonwebtoken");
const generateAccessToken = (payload) => {
  const jwtSecret = process.env.ACCESS_TOKEN_SECRET;
  const token = jwt.sign({ ...payload }, jwtSecret, {
    expiresIn: process.env.ACCESS_TOKEN_LIFETIME,
  });

  return token;
};
const generateRefreshToken = (payload) => {
  const jwtSecret = process.env.REFRESH_TOKEN_SECRET;
  const token = jwt.sign({ ...payload }, jwtSecret, {
    expiresIn: process.env.REFRESH_TOKEN_LIFETIME,
  });

  return token;
};

module.exports = { generateAccessToken, generateRefreshToken };
