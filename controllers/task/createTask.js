const { BadRequestError, CustomAPIError } = require("../../errors");
const { createTask: createTaskRepo } = require("../../db/repositories/task");

const createTask = async (req, res, next) => {
  const { userId } = req.user;

  const taskBody = {
    userId,
    title,
    description,
    category: category || "QA call",
    status: "In Progress",
    timeSpent: 0,
  };

  try {
    const result = await createTaskRepo(taskBody);
    return res.status(201).json({
      success: true,
      msg: {
        result,
      },
    });
  } catch (error) {
    console.log("Error creating task:", error);
    return next(new CustomAPIError("Error occured while creating task"));
  }
};

module.exports = createTask;
