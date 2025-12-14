const {
  TASK_CATEGORIES,
  TASK_STATUSES,
  GROUP_BY_OPTIONS,
} = require("./allowedValues");

const filterTaskSchema = Joi.object({
  // Category filter
  category: Joi.string()
    .valid(...TASK_CATEGORIES)
    .messages({
      "any.only": `Category must be one of: ${TASK_CATEGORIES.join(", ")}`,
    }),

  // Client filter
  client: Joi.string().trim().min(1).max(100).messages({
    "string.min": "Client name must be at least 1 character",
    "string.max": "Client name cannot exceed 100 characters",
  }),

  // Status filter
  status: Joi.string()
    .valid(...TASK_STATUSES)
    .messages({
      "any.only": `Status must be one of: ${TASK_STATUSES.join(", ")}`,
    }),

  // Date range filters
  startDate: Joi.date().iso().messages({
    "date.base": "Start date must be a valid date",
    "date.format": "Start date must be in ISO 8601 format (YYYY-MM-DD)",
  }),

  endDate: Joi.date()
    .iso()
    .min(Joi.ref("startDate")) // Must be >= startDate
    .messages({
      "date.base": "End date must be a valid date",
      "date.format": "End date must be in ISO 8601 format (YYYY-MM-DD)",
      "date.min": "End date must be on or after start date",
    }),

  // Text search
  search: Joi.string().trim().min(2).max(100).messages({
    "string.min": "Search term must be at least 2 characters",
    "string.max": "Search term cannot exceed 100 characters",
  }),

  // Dashboard grouping option
  groupBy: Joi.string()
    .valid(...GROUP_BY_OPTIONS)
    .messages({
      "any.only": `Group by must be one of: ${GROUP_BY_OPTIONS.join(", ")}`,
    }),

  // Pagination (for future use)
  page: Joi.number().integer().min(1).default(1).messages({
    "number.base": "Page must be a number",
    "number.integer": "Page must be a whole number",
    "number.min": "Page must be at least 1",
  }),

  limit: Joi.number().integer().min(1).max(100).default(20).messages({
    "number.base": "Limit must be a number",
    "number.integer": "Limit must be a whole number",
    "number.min": "Limit must be at least 1",
    "number.max": "Limit cannot exceed 100",
  }),
});

module.exports = filterTaskSchema;
