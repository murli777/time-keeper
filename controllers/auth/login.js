const bcrypt = require("bcryptjs");
const { client } = require("../../db/connect");
const updateUser = require("../../db/repositories/user/updateUser");
const {
  BadRequestError,
  UnauthenticatedError,
} = require("../../errors");
const { generateTokens } = require("../../helpers/generateJWT");

const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError("Please provide the email and password!"));
  }

  const userCollection = client.db("jobs").collection("users");
  const user = await userCollection.findOne({ email });

  if (!user) {
    return next(new UnauthenticatedError("Invalid Credentials!"));
  }

  const isAuthorised = await bcrypt.compare(password, user.password);

  if (!isAuthorised) {
    return next(new UnauthenticatedError("Invalid Credentials!"));
  }

  const { accessToken, refreshToken } = generateTokens(user);

  const updateData = await updateUser({ email }, { refreshToken });

  console.log(updateData);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 14 * 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === "production",
  });

  return res.status(201).json({
    success: true,
    msg: "authenticated",
    userId: updateData._id.toString(),
    accessToken,
  });
};

module.exports = login;