const fileService = require("../services/uploadService");
const { SIZEFILE } = require("../config/constant");
const uploadFile = require("../middleware/upload");
const fs = require("fs");
const { BaseResponse, ApplicationError } = require("../common/common");
const path = require("path");
const port = process.env.PORT;
const paginateResults = require("./contanstController");

const searchFile = async (req, res, next) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const q = req.query.q || "";
    const orderType = (req.query.orderType || "asc").toLowerCase();
    const orderField = req.query.orderField || "originalName";
    let select = req.query.select || ["originalName", "nameFile"];
    if (typeof select === "string") {
      select = [select];
    }
    const { file, totalCount } = await fileService.searchFile(
      q,
      orderType,
      page,
      limit,
      orderField,
      select
    );
    file.forEach((f) => {
      f.dataValues.viewFile = `${req.protocol}://${req.hostname}:${port}/v1/files/${f.nameFile}`;
    });
    const results = paginateResults(totalCount, limit, page, file);

    res.paginatedResults = results;
    return BaseResponse.success(res, 200, "success", { file, results });
  } catch (error) {
    return next(new ApplicationError(500, error));
  }
};

const getAllFilesById = async (req, res, next) => {
  const id = req.params.fileId;
  try {
    const files = await fileService.getAllFilesById(id);
    if (!files) {
      throw new ApplicationError(400, "Files not found");
    }
    return BaseResponse.success(res, 200, "success", files);
  } catch (error) {
    return next(new ApplicationError(500, error));
  }
};

const getFileById = async (req, res, next) => {
  const id = req.params.fileId;
  try {
    const file = await fileService.getFileById(id);
    if (!file) {
      throw new ApplicationError(400, "Files not found");
    }
    return BaseResponse.success(res, 200, "success", file);
  } catch (error) {
    return next(new ApplicationError(500, error));
  }
};

const updateFileById = async (req, res, next) => {
  const id = req.params.fileId;
  try {
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
  } catch (error) {
    return next(new ApplicationError(500, error));
  }
};

const deleteFileById = async (req, res, next) => {
  const id = req.params.fileId;
  try {
    const file = await fileService.getFileById(id);
    if (!file) {
      throw new ApplicationError(400, "File not found");
    }
    const fileName = file.nameFile; // them duong dan va cho vao cron
    fs.unlinkSync(fileName);
    await fileService.deleteFileById(id);
    return BaseResponse.success(res, 200, "success", { deleteFile: fileName });
  } catch (error) {
    return next(new ApplicationError(500, error));
  }
};

const viewFile = async (req, res, next) => {
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
    return next(new ApplicationError(500, error));
  }
};

const createFile = async (req, res, next) => {
  try {
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
  } catch (error) {
    return next(new ApplicationError(500, error));
  }
};

module.exports = {
  getFileById,
  updateFileById,
  deleteFileById,
  createFile,
  getAllFilesById,
  viewFile,
  searchFile,
};
