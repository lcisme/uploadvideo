const db = require("../database/models");
const File = db.File;
const Sequelize = require("sequelize");

const searchFile = async (q, orderType, page, limit, orderFiled, select) => {
  try {
    const OFFSET = (page - 1) * limit;
    const totalCount = await File.count({
      where: {
        [Sequelize.Op.or]: [
          { originalName: { [Sequelize.Op.like]: `%${q}%` } },
          { nameFile: { [Sequelize.Op.like]: `%${q}%` } },
        ],
      },
    });
    const a = {
      order: [[orderFiled, orderType]],
      limit: parseInt(limit),
      offset: OFFSET,
      attributes: select,
    };
    if (q) {
      a["where"] = {
        [Sequelize.Op.or]: [
          { originalName: { [Sequelize.Op.like]: `%${q}` } },
          { nameFile: { [Sequelize.Op.like]: `%${q}` } },
        ],
      };
    }
    const file = await File.findAll(a);
    return {file, totalCount};
  } catch (error) {
    throw error;
  }
};


const createFile = async (fileData) => {
  const newFile = await File.create(fileData);
  return newFile;
};

const getAllFilesById = async (userId) => {
  const files = await File.findAll({ where: { userId: userId },attributes: { exclude: ["deletedAt"] }, });
  return files;
};
const getFileById = async (fileId) => {
  const file = await File.findOne({
    where: { id: fileId },
    attributes: { exclude: ["deletedAt"] },
  });
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
    const updatedFile = await File.findOne({ where: { id: fileId }  ,attributes: { exclude: ["deletedAt"] }},);
    return updatedFile;
  } catch (error) {
    throw error;
  }
};


module.exports = {
  searchFile,
  createFile,
  getAllFilesById,
  getFileById,
  updateFileById,
};
