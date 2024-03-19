const File = require("../database/file");
const { SIZEFILE } = require("../config/constant");
const { BaseResponse, ApplicationError } = require("../common/common");
const fs = require("fs");
const uploadFile = require("../middleware/upload");
const path = require("path");

const searchFile = async (q, orderType, page, limit, orderField, select) => {
  return File.searchFile(q, orderType, page, limit, orderField, select);
};

const createFile = async (fileData) => {
  return File.createFile(fileData);
};

const getAllFilesById = async (fileId) => {
  return File.getAllFilesById(fileId);
};

const getFileById = async (fileId) => {
  return File.getFileById(fileId);
};

const updateFileById = async (res, req, id) => {
  try {
    const file = await File.getFileById(id);
    const fileName = file.nameFile;
    console.log(fileName);
    const filePathRemove = path.join(__dirname, "uploads", fileName);
    const newFilePath = filePathRemove.replace(
      "src\\services\\uploads",
      "uploads"
    );
    console.log(newFilePath);

    fs.unlinkSync(newFilePath);
    await uploadFile(req, res);

    if (!req.file) {
      throw new ApplicationError(400, "Please upload a file!");
    }
    if (req.file.size > SIZEFILE) {
      throw new ApplicationError(
        400,
        `File size cannot be larger than ${SIZEFILE}MB!`
      );
    }
    const filePath = path.basename(req.file.path);
    const updatedFile = await File.updateFileById(id, {
      nameFile: filePath,
    });
    return updatedFile;
  } catch (error) {
    throw new ApplicationError(500, error.message);
  }
};

const viewFile = async (viewFileUrl) => {
  try {
    const filePath = path.join(__dirname, "uploads", viewFileUrl);
    const newFilePath = filePath.replace(
      "src\\services\\uploads",
      "uploads"
    );
    return newFilePath;
  } catch (error) {
    throw new ApplicationError(500, error.message);
  }
};

module.exports = {
  searchFile,
  createFile,
  getAllFilesById,
  getFileById,
  updateFileById,
  viewFile
};
