const Joi = require("joi");
const { TASK_CATEGORIES, TASK_STATUSES } = require("./allowedValues");

const createTaskSchema = Joi.object({
  // Required fields
  title: Joi.string()
    .trim() // Remove whitespace from start/end
    .min(3) // Minimum 3 characters
    .max(100) // Maximum 100 characters
    .required() // Cannot be omitted
    .messages({
      "string.empty": "Title cannot be empty",
      "string.min": "Title must be at least 3 characters long",
      "string.max": "Title cannot exceed 200 characters",
      "any.required": "Title is required",
    }),

  description: Joi.string().trim().min(5).max(2500).required().messages({
    "string.empty": "Description cannot be empty",
    "string.min": "Description must be at least 5 characters long",
    "string.max": "Description cannot exceed 2000 characters",
    "any.required": "Description is required",
  }),

  client: Joi.string().trim().min(2).max(50).required().messages({
    "string.min": "Client name must be at least 2 characters long",
    "string.max": "Client name cannot exceed 100 characters",
  }),

  category: Joi.string()
    .valid(...TASK_CATEGORIES) // Must be one of the predefined categories
    .required()
    .messages({
      "any.only": `Category must be one of: ${TASK_CATEGORIES.join(", ")}`,
      "any.required": "Category is required",
    }),

  // Time tracking fields
  timeSpent: Joi.number()
    .integer() // Must be whole number
    .min(0) // Cannot be negative
    .default(0) // If not provided, default to 0
    .messages({
      "number.base": "Time spent must be a number",
      "number.integer": "Time spent must be a whole number",
      "number.min": "Time spent cannot be negative",
    }),

  startTime: Joi.date()
    .iso() // Must be valid ISO 8601 date
    .required() // Allow null value
    .messages({
      "date.base": "Start time must be a valid date",
      "date.format": "Start time must be in ISO 8601 format",
    }),

  endTime: Joi.date()
    .iso()
    .required()
    .greater(Joi.ref("startTime")) // Must be after startTime
    .messages({
      "date.base": "End time must be a valid date",
      "date.format": "End time must be in YYYY-MM-DD format",
      "date.greater": "End time must be after start time",
    }),

  status: Joi.string()
    .valid(...TASK_STATUSES)
    .default("pending") // Default to 'pending' if not provided
    .messages({
      "any.only": `Status must be one of: ${TASK_STATUSES.join(", ")}`,
    }),

  tags: Joi.array()
    .items(
      // Each item in array must be:
      Joi.string().trim().min(2).max(20)
    )
    .min(0) // Can be empty array
    .max(5) // Maximum 5 tags
    .unique() // No duplicate tags
    .default([]) // Default to empty array
    .messages({
      "array.max": "Cannot have more than 5 tags",
      "array.unique": "Tags must be unique",
      "string.min": "Each tag must be at least 2 characters long",
      "string.max": "Each tag cannot exceed 20 characters",
    }),
});

module.exports = createTaskSchema;
