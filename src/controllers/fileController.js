const fileService = require("../services/uploadService");
const fileModel = require("../database/models/file.model");
const { SIZEFILE, URL_PATH } = require("../config/constant");
const { v4: uuidv4 } = require("uuid");
const uploadFile = require("../middleware/upload");
const fs = require("fs");

class ApplicationError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

class BaseResponse {
  constructor() {
    this.statusCode = 200;
    this.message = "success";
    this.data = {};
    this.error = null;
  }

  static success(res, statusCode, message, data) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    return res.status(this.statusCode).json({
      message: this.message,
      data: this.data,
    });
  }

  static error(statusCode, message, error) {
    this.statusCode = statusCode;
    this.message = message;
    this.error = error;
  }
}

const getAllFiles = async (req, res, next) => {
  try {
    const files = await fileService.getAllFiles();
    if (!files) {
      throw new ApplicationError(400, "files not found");
    }
    return BaseResponse.success(res, 200, "success", files);
  } catch (error) {
    return next(new ApplicationError(500, "Cannot get all files "));
  }
};

const getFileById = async (req, res, next) => {
  console.log(req.params.fileId);
  const id = req.params.fileId;
  try {
    const file = await fileService.getFileById(id);
    console.log(file);
    if (!file) {
      throw new ApplicationError(400, "file not found");
    }
    return BaseResponse.success(res, 200, "success", file);
  } catch (error) {
    console.log(error);
    return next(new ApplicationError(500, "Cannot get file"));
  }
};

const updateFileById = async (req, res, next) => {
  const id = req.params.fileId;
  try {
    const file = await fileService.getFileById(id);
    const fileName = file.nameFile;
    console.log(fileName);
    fs.unlinkSync(fileName);
    await uploadFile(req, res);
    if (!req.file) {
      throw new ApplicationError(400, "Please upload a file!");
    }
    if (req.file.size > SIZEFILE) {
      throw new ApplicationError(
        500,
        `File size cannot be larger than ${SIZEFILE}MB!`
      );
    }
    const filePath = req.file.path;
    console.log(filePath);
    const updatedFile = await fileService.updateFileById(id, {nameFile: filePath,});

    return BaseResponse.success(
      res,
      200,
      "Updated the file successfully",
      updatedFile
    );
  } catch (error) {
    return next(new ApplicationError(500, "Cannot update file"));
  }
};

const deleteFileById = async (req, res, next) => {
  const id = req.params.fileId;
  try {
    const file = await fileService.getFileById(id);
    if (!file) {
      throw new ApplicationError(400, "File not found");
    }
    const fileName = file.nameFile;
    fs.unlinkSync(fileName);
    await fileService.deleteFileById(id);
    return BaseResponse.success(res, 200, "success", { deleteFile: fileName });
  } catch (error) {
    return next(new ApplicationError(500, "Cannot delete file"));
  }
};

const createFile = async (req, res, next) => {
  try {
    await uploadFile(req, res);

    if (!req.file) {
      throw new ApplicationError(400, "Please upload a file!");
    }
    if (req.file.size > SIZEFILE) {
      throw new ApplicationError(
        500,
        `File size cannot be larger than ${SIZEFILE}MB!`
      );
    }
    const idUser = req.userData.id
    const filePath = req.file.path;
    const fileRecord = await fileService.createFile({ nameFile: filePath, user_Id: idUser });
    return BaseResponse.success(
      res,
      200,
      "Uploaded the file successfully",
      fileRecord
    );
  } catch (error) {
    return next(new ApplicationError(500, "Cannot create file"));
  }
};

module.exports = {
  getAllFiles,
  getFileById,
  updateFileById,
  deleteFileById,
  createFile,
};
