const { client } = require("../connect");

const DB_NAME = process.env.DB_NAME || "jobs";

const getCollection = (collectionName) => {
  return client.db(DB_NAME).collection(collectionName);
};

module.exports = {
  getCollection,
  DB_NAME,
};
