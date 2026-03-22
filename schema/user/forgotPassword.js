const Joi = require("joi");

const forgotPasswordSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.email": "Please provide a valid email",
      "any.required": "Email is required",
    }),
});

module.exports = forgotPasswordSchema;