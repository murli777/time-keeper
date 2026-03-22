const {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} = require("../schema/user");

const schemaValidator = (schema, prop = "body") => {
  return (req, res, next) => {
    const data = req[prop];
    const { error, value } = schema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((err) => {
        return err.message;
      });

      return res.status(400).json({
        success: false,
        msg: "Invalid request",
        errors,
      });
    }
    req[prop] = value;
    next();
  };
};

const validateSignupBody = schemaValidator(signupSchema, "body");
const validateLoginBody = schemaValidator(loginSchema, "body");
const validateForgotPasswordBody = schemaValidator(forgotPasswordSchema, "body");
const validateResetPasswordBody = schemaValidator(resetPasswordSchema, "body");

module.exports = {
  validateSignupBody,
  validateLoginBody,
  validateForgotPasswordBody,
  validateResetPasswordBody,
};