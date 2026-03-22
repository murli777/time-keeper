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

const validateObjectId = require("../middleware/validateObjectId");

router.get("/", validateFilterBody, getUserTasks);
router.post("/", validateNewTaskBody, createTask);
router.get("/:id", validateObjectId("id"), getTask);
router.patch("/:id", validateObjectId("id"), validateUpdateTaskBody, updateTask);
router.delete("/:id", validateObjectId("id"), deleteTask);

module.exports = router;
