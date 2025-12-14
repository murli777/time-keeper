const { ObjectId } = require("mongodb");
const { getCollection } = require("../../collectionHelper");

const getTaskById = async (taskId, userId) => {
  try {
    const collection = getCollection("tasks");
    const task = await collection.findOne({
      _id: new ObjectId(taskId),
      userId: new ObjectId(userId),
    });

    return task;
  } catch (error) {
    console.log("Error fetching task: ", error);
    throw error;
  }
};

module.exports = getTaskById;
