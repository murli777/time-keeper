const { ObjectId } = require("mongodb");
const { getCollection } = require("../../collectionHelper");

const updateTaskById = async (taskId, userId, updateData) => {
  try {
    const collection = getCollection("tasks");
    const result = await collection.findOneAndUpdate(
      {
        _id: new ObjectId(taskId),
        userId: new ObjectId(userId),
      },
      {
        $set: {
          ...updateData,
          updatedAt: new Date(),
        },
      },
      {
        returnDocument: "after",
      }
    );

    return result;
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

module.exports = updateTaskById;
