const File = require("../database/file");

const getAllFiles = async () => {
  return File.getAllFiles();
};

const getAllFilesById = async (fileId) => {
  return File.getAllFilesById(fileId);
};

const getFileById = async (fileId) => {
  return File.getFileById(fileId);
};

const updateFileById = async (fileId, updateParams) => {
  return File.updateFileById(fileId, updateParams);
};

const deleteFileById = async (fileId) => {
  return File.deleteFileById(fileId);
};

const createFile = async (fileData) => {
  return File.createFile(fileData);
};

module.exports = {
  getAllFiles,
  getFileById,
  updateFileById,
  deleteFileById,
  createFile,
  getAllFilesById,
};
