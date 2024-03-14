const db = require("../database/models");
const File = db.File;

const moveToTrash = async (fileId) => {
  const now = new Date();
  const delayTimeInMs = 5 * 60 * 1000; // 5 phút
  const deleteTime = new Date(now.getTime() + delayTimeInMs);
  await File.update({ status: 1, deletedAt: deleteTime }, { where: { id: fileId } });
};

const deleteFilesInTrash = async () => {
  const now = new Date();
  const filesInTrash = await File.findAll({ where: { status: 1, deletedAt: { [Sequelize.Op.lt]: now } } });

  // Xóa các file trong thùng rác
  for (const file of filesInTrash) {
    await file.destroy();
    console.log(`File with ID ${file.id} has been deleted from trash.`);
  }
};

// Gọi hàm để xóa file trong thùng rác mỗi 5 phút
setInterval(deleteFilesInTrash, 5 * 60 * 1000);