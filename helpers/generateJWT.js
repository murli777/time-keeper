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

const generateTokens = (user) => {
  const payload = {
    userId: user._id.toString(),
    name: user.name,
    email: user.email,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  return { accessToken, refreshToken };
};

module.exports = { generateAccessToken, generateRefreshToken, generateTokens };
