const { BaseResponse } = require("../common/common");
const trashService = require("../services/trashService");

const moveToTrash = async (req, res) => {
  const fileId = req.params.fileId;
  try {
    await trashService.moveToTrash(fileId);
    return BaseResponse.success(res, 200, "File moved to trash successfully");
  } catch (error) {
    return BaseResponse.error(res, 500, "Internal server error");
  }
};

module.exports = {
  moveToTrash,
};
