const filterContructor = (filterQuery) => {
  const filters = {};

  if (filterQuery.startDate || filterQuery.endDate) {
    filters.startTime = {};
    if (filterQuery.startDate) {
      filters.startTime.$gte = new Date(filterQuery.startDate);
    }
    if (filterQuery.endDate) {
      const endDate = new Date(filterQuery.endDate);
      endDate.setHours(23, 59, 59, 999); // Include entire end date
      filters.startTime.$lte = endDate;
    }
  }

  if (filterQuery.category) {
    filters.category = filterQuery.category;
  }

  if (filterQuery.client) {
    filters.client = filterQuery.client;
  }

  if (filterQuery.status) {
    filters.status = filterQuery.status;
  }

  if (filterQuery.search) {
    filters.$or = [
      { title: { $regex: filterQuery.search, $options: "i" } },
      { description: { $regex: filterQuery.search, $options: "i" } },
    ];
  }

  return filters;
};

module.exports = filterContructor;
