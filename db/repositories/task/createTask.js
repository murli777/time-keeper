const { getCollection } = require("../../collectionHelper");

const createTask = async (document) => {
  try {
    const collection = getCollection("tasks");
    const taskData = {
      ...document,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(taskData);
    return { _id: result.insertedId, ...taskData };
  } catch (error) {
    console.log("Error creating task: ", error);
    throw error;
  }
};

module.exports = createTask;
