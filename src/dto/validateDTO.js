const { ApplicationError } = require("../common/common");

const checkParams = (req, res, next) => {
  const { userId, fileId } = req.params;
  const { q, limit, page, orderField, orderType, select } = req.query;
  if (limit !== undefined && (isNaN(Number(limit)) || Number(limit) < 0)) {
    throw new ApplicationError(400, "Limit must be a non-negative number");
  }

  if (page !== undefined && (isNaN(Number(page)) || Number(page) < 0)) {
    throw new ApplicationError(400, "Page must be a non-negative number");
  }

  if (
    orderType !== undefined &&
    !["asc", "desc"].includes(orderType.toLowerCase())
  ) {
    throw new ApplicationError(400, "Invalid orderType. Must be ASC or DESC");
  }

  if (userId != undefined && (isNaN(Number(userId)) || Number(userId) <= 0)) {
    throw new ApplicationError(400, "UserId ust be a non-negative number. ");
  }
  if (fileId != undefined && (isNaN(Number(fileId)) || Number(fileId) <= 0)) {
    throw new ApplicationError(400, "FileId ust be a non-negative number. ");
  }

  next();
};

module.exports = { checkParams };
