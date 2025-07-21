const { client } = require("../../connect");

const collection = client.db("jobs").collection("users");

const updateById = async (searchQuery, data) => {
  try {
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
