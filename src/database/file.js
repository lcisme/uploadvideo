const File = require("./models/fileModel");

const createFile = (fileData) => {
  return File.create(fileData);
};

const getFileById = async (fileId) => {
  return File.findByPk(fileId);
};

const getAllFiles = async () => {
  return File.findAll();
};

const deleteFileById = async (fileId) => {
  const deletedFile = await File.destroy({ where: { id: fileId } });
  return deletedFile;
};

// const updateFileById = async (fileId, updateParams) => {
//   const [updatedRows] = await File.update(updateParams, {
//     where: { id: fileId },
//   });
//   if (updatedRows === 0) {
//     return null;
//   }
//   return File.findByPk(fileId);
// };

module.exports = {
  createFile,
  getFileById,
  getAllFiles,
  deleteFileById,
  //   updateFileById,
};
