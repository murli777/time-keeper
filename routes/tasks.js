const express = require("express");
const router = express.Router();

const {
  createTask,
  getUserTasks,
  getTask,
  updateTask,
  deleteTask,
} = require("../controllers/task");

const {
  validateFilterBody,
  validateNewTaskBody,
  validateUpdateTaskBody,
} = require("../middleware/createTaskValidator");

router.get("/", validateFilterBody, getUserTasks);
router.post("/", validateNewTaskBody, createTask);
router.get("/:id", getTask);
router.patch("/:id", validateUpdateTaskBody, updateTask);
router.delete("/:id", deleteTask);

module.exports = router;
