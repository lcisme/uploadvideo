const db = require("../database/models");
const File = db.File;
const TimeDelete = db.TimeDelete;

const moveToTrash = async (fileId) => {
  try {
    const timeDB = await TimeDelete.findOne({ attributes: ["xNumber"] });
    const x = timeDB !== null ? timeDB.xNumber : 2;
    const now = new Date();
    const delayTimeInMs = x * 60 * 1000;
    const deleteTime = new Date(now.getTime() + delayTimeInMs);
    await File.update(
      { status: 0, deletedAt: deleteTime },
      { where: { id: fileId } }
    );
    console.log("File moved to trash successfully.");
  } catch (error) {
    console.error("Error moving file to trash:", error);
  }
};

module.exports = { moveToTrash };
