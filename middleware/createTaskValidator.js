const {
  createTaskSchema,
  updateTaskSchema,
  filterTaskSchema,
} = require("../schema/task");

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

const validateNewTaskBody = schemaValidator(createTaskSchema, "body");
const validateUpdateTaskBody = schemaValidator(updateTaskSchema, "body");
const validateFilterBody = schemaValidator(filterTaskSchema, "query");

module.exports = {
  validateNewTaskBody,
  validateUpdateTaskBody,
  validateFilterBody,
};
