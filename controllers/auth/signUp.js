const { MongoServerError } = require("mongodb");
const { nameValidator, hashPassword } = require("../../helpers");
const createUser = require("../../db/repositories/user/createUser");
const {
  CustomAPIError,
  BadRequestError,
} = require("../../errors");

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

module.exports = signUp;