const db = require("../database/models");
const File = db.File;
const multer = require('multer')

const createFile = async (fileData) => {
  const newFile = await File.create(fileData);
  return newFile;
};

const getAllFiles = async () => {
  const files = await File.findAll();
  return files;
};

const getAllFilesById = async (fileId) => {
  const files = await File.findAll({ where: { user_Id: fileId } });
  return files;
};
const getFileById = async (fileId) => {
  const file = await File.findOne({ where: { id: fileId } });
  return file;
};

const updateFileById = async (fileId, updateParams) => {
  try {
    const [, rowsUpdated] = await File.update(updateParams, {
      where: { id: fileId },
    });

    if (rowsUpdated === 0) {
      throw new Error("Fail");
    }
    const updatedFile = await File.findOne({ where: { id: fileId } });
    return updatedFile;
  } catch (error) {
    throw error;
  }
};

const deleteFileById = async (fileId) => {
  try {
    const deletedFile = await File.destroy({ where: { id: fileId } });
    return deletedFile;
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
};

module.exports = {
  getAllFiles,
  getFileById,
  updateFileById,
  deleteFileById,
  createFile,
  getAllFilesById
};
