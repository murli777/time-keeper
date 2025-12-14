const { UnauthenticatedError } = require("../../errors");
const { client } = require("../../db/connect");
const { generateAccessToken } = require("../../helpers/generateJWT");
const jwt = require("jsonwebtoken");

const refreshToken = async (req, res, next) => {
  const cookies = req.cookies;

  console.log("Cookies:", cookies);

  if (!cookies?.refreshToken) {
    return next(new UnauthenticatedError("Unauthorised!"));
  }

  const userCollection = client.db("jobs").collection("users");
  const user = await userCollection.findOne({
    refreshToken: cookies.refreshToken,
  });

  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      maxAge: 14 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === "production",
    });
    return next(new UnauthenticatedError("Please login again!"));
  }

  const verifiedJWT = jwt.verify(
    cookies.refreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );

  if (!verifiedJWT || user.email !== verifiedJWT.email) {
    res.clearCookies("refreshToken");
    return next(new UnauthenticatedError("Please login again!"));
  }
  const accessToken = generateAccessToken({
    userId: user._id.toString(),
    name: user.name,
    email: user.email,
  });

  return res.json({
    accessToken,
  });
};

module.exports = refreshToken;
