const { MongoServerError } = require("mongodb");
const bcrypt = require("bcryptjs");
const { nameValidator, hashPassword } = require("../helpers");
const createUser = require("../db/repositories/user/createUser");
const updateUser = require("../db/repositories/user/updateUser");
const {
  CustomAPIError,
  BadRequestError,
  UnauthenticatedError,
} = require("../errors");
const { client } = require("../db/connect");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../helpers/generateJWT");
const refreshToken = require("./refreshToken");

const signUp = async (req, res, next) => {
  const { name, email, password } = req.body;

  const isValidName = nameValidator(name);
  if (!isValidName) {
    return next(new BadRequestError("Please provide a valid name!"));
  }

  try {
    const hashedPass = await hashPassword(password);

    const userBody = { name, email, password: hashedPass };
    await createUser({ ...userBody });

    return res.status(201).json({
      success: true,
      msg: "created",
    });
  } catch (error) {
    console.log(error);

    if (error instanceof MongoServerError && error.code === 11000) {
      return next(
        new CustomAPIError("User with the email already exists!", 409)
      );
    } else {
      return next(new CustomAPIError("Something went wrong!"));
    }
  }
};

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

  const accessToken = generateAccessToken({
    name: user.name,
    email: user.email,
  });

  const refreshToken = generateRefreshToken({
    name: user.name,
    email: user.email,
  });

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

const logout = async (req, res, next) => {
  const cookies = req.cookies;

  if (!cookies?.refreshToken) {
    return res.status(204).json({ msg: "No content" });
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
    return res.status(204).json({ msg: "No content" });
  }

  await updateUser(
    { refreshToken: cookies.refreshToken },
    { refreshToken: "" }
  );

  res.clearCookie("refreshToken", {
    httpOnly: true,
    maxAge: 14 * 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === "production",
  });

  return res.status(200).json({
    success: true,
    msg: "Logged out successfully",
  });
};

module.exports = {
  signUp,
  login,
  logout,
};
