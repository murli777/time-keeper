const { ObjectId } = require("mongodb");
const { getCollection } = require("../../collectionHelper");

const deleteTask = async (taskId, userId) => {
  try {
    const collection = getCollection("tasks");
    const result = await collection.deleteOne({
      _id: new ObjectId(taskId),
      userId: new ObjectId(userId),
    });

    return result;
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};

module.exports = deleteTask;
