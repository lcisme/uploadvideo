const fileService = require("../services/uploadService");
const { SIZEFILE } = require("../config/constant");
const uploadFile = require("../middleware/upload");
const fs = require("fs");
const { BaseResponse, ApplicationError } = require("../common/common");
const e = require("express");
const path = require("path");
const port = process.env.PORT;

const getAllFiles = async (req, res, next) => {
  const files = await fileService.getAllFiles();
  if (!files) {
    throw new ApplicationError(400, "Files not found");
  }
  const results = files.map((file) => {
    console.log(file.dataValues);
    return {
      ...file.dataValues,
      viewFile: `${req.protocol}://${req.hostname}:${port}/v1/files/${file.nameFile}`,
    };
  });
  return BaseResponse.success(res, 200, "success", results);
};

const getAllFilesById = async (req, res, next) => {
  const id = req.params.fileId;
  const files = await fileService.getAllFilesById(id);
  if (!files) {
    throw new ApplicationError(400, "Files not found");
  }
  return BaseResponse.success(res, 200, "success", files);
};

const getFileById = async (req, res, next) => {
  const id = req.params.fileId;
  const file = await fileService.getFileById(id);
  if (!file) {
    throw new ApplicationError(400, "Files not found");
  }
  return BaseResponse.success(res, 200, "success", file);
};

const updateFileById = async (req, res, next) => {
  const id = req.params.fileId;
  const file = await fileService.getFileById(id);
  const fileName = file.nameFile;
  fs.unlinkSync(fileName);
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
  const filePath = req.file.path;
  const updatedFile = await fileService.updateFileById(id, {
    nameFile: filePath,
  });
  return BaseResponse.success(
    res,
    200,
    "Updated the file successfully",
    updatedFile
  );
};

const deleteFileById = async (req, res, next) => {
  const id = req.params.fileId;

  const file = await fileService.getFileById(id);
  if (!file) {
    throw new ApplicationError(400, "File not found");
  }
  const fileName = file.nameFile; // them duong dan va cho vao cron
  fs.unlinkSync(fileName);
  await fileService.deleteFileById(id);
  return BaseResponse.success(res, 200, "success", { deleteFile: fileName });
};

const viewFile = async (req, res, next) => {
  console.log("suck my dick");
  console.log(req.params);
  try {
    const { viewFileUrl } = req.params;
    const filePath = path.join(__dirname, "uploads", viewFileUrl);
    const newFilePath = filePath.replace(
      "src\\controllers\\uploads",
      "uploads"
    );
    console.log(filePath + "heheh");
    res.sendFile(newFilePath);
  } catch (error) {
    next(error);
  }
};

const createFile = async (req, res, next) => {
  console.log(SIZEFILE);
  await uploadFile(req, res);

  if (!req.file) {
    return BaseResponse.error(res, 400, "Please upload a file!");
  }
  if (req.file.size > SIZEFILE) {
    throw new ApplicationError(
      400,
      `File size cannot be larger than ${SIZEFILE}MB!`
    );
  }
  const nameFirst = req.file.originalname;
  const fileName = req.file.filename;
  const idUser = req.userData.id;
  const fileRecord = await fileService.createFile({
    originalName: nameFirst,
    nameFile: fileName,
    userId: idUser,
  });
  return BaseResponse.success(res, 200, "Uploaded the file successfully", {
    ...fileRecord.dataValues,
    viewFile: `${req.protocol}://${req.hostname}:${port}/v1/files/${fileName}`,
  });
};

module.exports = {
  getAllFiles,
  getFileById,
  updateFileById,
  deleteFileById,
  createFile,
  getAllFilesById,
  viewFile,
};
