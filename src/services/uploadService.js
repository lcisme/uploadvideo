const File = require("../database/file");


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

const searchFile = async (q, orderType, page, limit, orderField, select) => {
  return File.searchFile(q, orderType, page, limit, orderField, select);
};
module.exports = {
  getFileById,
  updateFileById,
  deleteFileById,
  createFile,
  getAllFilesById,
  searchFile,
};
