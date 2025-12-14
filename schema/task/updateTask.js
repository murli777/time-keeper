const Joi = require("joi");
const { TASK_CATEGORIES, TASK_STATUSES } = require("./allowedValues");

const updateTaskSchema = Joi.object({
  // All fields are optional for updates
  // User can update only what they want to change

  title: Joi.string().trim().min(3).max(100).messages({
    "string.empty": "Title cannot be empty",
    "string.min": "Title must be at least 3 characters long",
    "string.max": "Title cannot exceed 100 characters",
  }),

  description: Joi.string().trim().min(5).max(2500).messages({
    "string.empty": "Description cannot be empty",
    "string.min": "Description must be at least 5 characters long",
    "string.max": "Description cannot exceed 2500 characters",
  }),

  client: Joi.string().trim().min(2).max(50).messages({
    "string.empty": "Client name cannot be empty",
    "string.min": "Client name must be at least 2 characters long",
    "string.max": "Client name cannot exceed 50 characters",
  }),

  category: Joi.string()
    .valid(...TASK_CATEGORIES)
    .messages({
      "any.only": `Category must be one of: ${TASK_CATEGORIES.join(", ")}`,
    }),

  timeSpent: Joi.number().integer().min(0).messages({
    "number.base": "Time spent must be a number",
    "number.integer": "Time spent must be a whole number",
    "number.min": "Time spent cannot be negative",
  }),

  startTime: Joi.date().iso().messages({
    "date.base": "Start time must be a valid date",
    "date.format": "Start time must be in ISO 8601 format",
  }),

  endTime: Joi.date().iso().messages({
    "date.base": "End time must be a valid date",
    "date.format": "End time must be in ISO 8601 format",
  }),

  status: Joi.string()
    .valid(...TASK_STATUSES)
    .messages({
      "any.only": `Status must be one of: ${TASK_STATUSES.join(", ")}`,
    }),

  tags: Joi.array()
    .items(Joi.string().trim().min(2).max(20))
    .min(0)
    .max(5)
    .unique()
    .messages({
      "array.max": "Cannot have more than 5 tags",
      "array.unique": "Tags must be unique",
      "string.min": "Each tag must be at least 2 characters long",
      "string.max": "Each tag cannot exceed 20 characters",
    }),
})
  .min(1) // At least one field must be provided for update
  .messages({
    "object.min": "At least one field must be provided for update",
  });

module.exports = updateTaskSchema;
