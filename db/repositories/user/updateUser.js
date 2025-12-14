const { getCollection } = require("../../collectionHelper");

const updateById = async (searchQuery, data) => {
  try {
    const collection = getCollection("users");
    const result = await collection.findOneAndUpdate(
      { ...searchQuery },
      { $set: data },
      { returnDocument: "after", projection: { password: -1 } }
    );

    console.log(result);

    return result;
  } catch (error) {
    console.error("Error updating document:", error);
    throw error;
  }
};

module.exports = updateById;
