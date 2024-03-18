const paginateResults = (totalCount, limit, page, data) => {
  const totalPages = Math.ceil(totalCount / limit);
  const hasBackPage = !(parseInt(page) === 1 || totalCount === 0);
  const countData = data.length;
  const totalQueriesData = (page - 1) * limit + countData;
  const totalItems = totalCount;
  const isLastPage = totalQueriesData >= totalItems;
  const hasNextPage = !(countData < parseInt(limit)) && !isLastPage;

  return {
    pagination: {
      total: totalCount,
      totalPages: totalPages,
      hasNextPage: hasNextPage,
      hasBackPage: hasBackPage,
      nextPage: hasNextPage ? parseInt(page) + 1 : "Cannot next",
      backPage: hasBackPage ? parseInt(page) - 1 : "Cannot back",
    },
  };
};

module.exports = paginateResults;
