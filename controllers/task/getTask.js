const {
  NotFoundError,
  BadRequestError,
  CustomAPIError,
} = require("../../errors");
const { getTaskById: getTaskByIdRepo } = require("../../db/repositories/task");
const isValidObjectId = require("../../helpers/isValidObjectId");

const getTask = async (req, res, next) => {
  const { taskId } = req.params;
  const userId = req.user;

  const validObjectId = isValidObjectId(taskId);

  if (!validObjectId) {
    return next(new BadRequestError("Invalid task ID"));
  }

  try {
    const result = await getTaskByIdRepo(taskId, userId);

    if (!result) {
      return next(new NotFoundError("Task not found"));
    }

    res.status(200).json({
      success: true,
      msg: result,
    });
  } catch (error) {
    console.log("Error while fetching task: " + error);
    return next(
      new CustomAPIError("Something went wrong. Please try again later.")
    );
  }
};

module.exports = getTask;
