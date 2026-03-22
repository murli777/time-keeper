const Joi = require("joi");

const resetPasswordSchema = Joi.object({
  token: Joi.string()
    .required()
    .messages({
      "any.required": "Token is required",
    }),

  newPassword: Joi.string()
    .min(8)
    .required()
    .messages({
      "string.min": "New password must be at least 8 characters long",
      "any.required": "New password is required",
    }),
});

module.exports = resetPasswordSchema;