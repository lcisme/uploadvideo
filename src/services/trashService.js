const db = require("../database/models");
const File = db.File;

const moveToTrash = async (fileId) => {
  const now = new Date();
  const delayTimeInMs = 2 * 60 * 1000;
  const deleteTime = new Date(now.getTime() + delayTimeInMs);
  await File.update(
    { status: 0, deletedAt: deleteTime },
    { where: { id: fileId } }
  );
};

module.exports = { moveToTrash };
