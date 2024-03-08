const fileService = require("../services/uploadService");
const fileModel = require("../database/models/file.model");
const { SIZEFILE } = require("../config/constant");
const { v4: uuidv4 } = require("uuid");

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
    return next(new ApplicationError(500, "Cannot get all files"));
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
  const updateParams = req.body;
  try {
    const file = await fileService.updateFileById(id, updateParams);
    if (!file) {
      throw new ApplicationError(400, "file not found");
    }
    return BaseResponse.success(res, 200, "success", { file });
  } catch (error) {
    return next(new ApplicationError(500, "Cannot update file"));
  }
};

const deleteFileById = async (req, res, next) => {
  const id = req.params.fileId;
  try {
    const file = await fileService.deleteFileById(id);
    if (!file) {
      throw new ApplicationError(400, "file not found");
    }
    return BaseResponse.success(res, 200, "success");
  } catch (error) {
    return next(new ApplicationError(500, "Cannot delete file"));
  }
};

const createFile = async (req, res, next) => {
  const nameFileReq = req.file;
  const id = uuidv4();
  const ext = req.file.originalname.split(".").pop().toLowerCase();
  const fileSize = nameFileReq.size;
 
  const newFileName = `${id}.${ext}`;
  if (fileSize > SIZEFILE) {
    return next(new ApplicationError(400, "File size exceeds the limit"));
  }

  try {
    const newFile = await fileService.createFile({
      nameFile: newFileName,
    });

    if (!newFile) {
      throw new ApplicationError(400, "File name is required");
    }

    return BaseResponse.success(res, 201, "File created successfully", newFile);
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
