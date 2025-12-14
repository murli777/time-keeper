const { CustomAPIError } = require("../../errors");
const {
  getUserTasksRepo: getUserTasks,
} = require("../../db/repositories/task");
const filterContructor = require("../../helpers/filterConstructor");

const getUserTasks = async (req, res, next) => {
  const { userId } = req.user;

  const filters = filterContructor(req.query);

  try {
    const result = await getUserTasksRepo(userId, filters);

    res.status(200).json({
      success: true,
      msg: result,
    });
  } catch (error) {
    console.log("Error fetching tasks:", error);
    return next(new CustomAPIError("Error occured while getting task"));
  }
};

module.exports = getUserTasks;
