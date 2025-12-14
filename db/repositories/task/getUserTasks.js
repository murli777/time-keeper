const { ObjectId } = require("mongodb");
const { getCollection } = require("../../collectionHelper");

const getUserTasks = async (userId, filters = {}) => {
  try {
    const collection = getCollection("tasks");

    const sortOption = { createdAt: -1 }; // Default: newest first

    const page = filters.page ? parseInt(filters.page) : 1;
    const limit = filters.limit ? parseInt(filters.limit) : 20;
    const skip = (page - 1) * limit;

    const { page: _, limit: __, ...queryFilters } = filters;

    const mongoFilter = {
      userId: new ObjectId(userId),
      ...queryFilters,
    };

    const tasks = await collection
      .find(mongoFilter)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await collection.countDocuments(mongoFilter);

    return {
      tasks,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.log("Error fetching user tasks: ", error);
    throw error;
  }
};

module.exports = getUserTasks;
