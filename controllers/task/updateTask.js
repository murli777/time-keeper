const { NotFoundError, CustomAPIError } = require("../../errors");
const {
  getTaskById: getTaskByIdRepo,
  updateTask: updateTaskRepo,
} = require("../../db/repositories/task");
const isValidObjectId = require("../../helpers/isValidObjectId");

const updateTask = async (req, res, next) => {
  const { taskId } = req.params;
  const updateData = req.body;
  const { userId } = req.user;

  try {
    const validTaskId = isValidObjectId(taskId);
    const task = await getTaskByIdRepo(taskId, userId);

    if (!task || !validTaskId) {
      return next(
        new NotFoundError(
          "Task not found or you do not have permission to edit it."
        )
      );
    }
  } catch (error) {
    return next(
      new CustomAPIError("Error occurred while updating the task...")
    );
  }

  try {
    const result = await updateTaskRepo(taskId, userId, updateData);

    res.status(200).json({
      success: true,
      msg: result,
    });
  } catch (error) {
    return next(
      new CustomAPIError("Error occurred while updating the task...")
    );
  }
};

module.exports = updateTask;
