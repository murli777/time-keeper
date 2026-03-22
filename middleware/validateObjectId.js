const { ObjectId } = require("mongodb");
const { BadRequestError } = require("../errors");

const validateObjectId = (paramName) => {
  return (req, res, next) => {
    const id = req.params[paramName];
    if (!ObjectId.isValid(id)) {
      return next(new BadRequestError(`Invalid ${paramName} format`));
    }
    next();
  };
};

module.exports = validateObjectId;