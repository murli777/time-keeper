const Joi = require("joi");

const signupSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(1)
    .max(25)
    .required()
    .messages({
      "string.empty": "Name cannot be empty",
      "string.min": "Name must be at least 1 character long",
      "string.max": "Name cannot exceed 25 characters",
      "any.required": "Name is required",
    }),

  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.email": "Please provide a valid email",
      "any.required": "Email is required",
    }),

  password: Joi.string()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/)
    .required()
    .messages({
      "string.pattern.base": "Password must be 8-20 characters long, contain only letters, numbers, and special characters (@$!%*?&), and include at least one lowercase letter, one uppercase letter, and one special character",
      "any.required": "Password is required",
    }),
});

module.exports = signupSchema;