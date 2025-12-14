const { getCollection } = require("../../collectionHelper");

const createUser = async (document) => {
  try {
    const collection = getCollection("users");
    const result = await collection.insertOne(document);
    return result;
  } catch (error) {
    console.log("Error: ", error);
    throw error;
  }
};

module.exports = createUser;
