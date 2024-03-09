const express = require("express");

const router = new express.Router();
const { checkAuth, checkRoleUserFile } = require("../authentication/checkAuth");

const fileController = require("../controllers/fileController");

// crud
router.get("/getAll", checkAuth, checkRoleUserFile, fileController.getAllFiles);
router.post("/upload", checkAuth, fileController.createFile);
router.get(
  "/:fileId",
  checkAuth,
  checkRoleUserFile,
  fileController.getFileById
);
router.patch(
  "/:fileId",
  checkAuth,
  checkRoleUserFile,
  fileController.updateFileById
);
router.delete(
  "/:fileId",
  checkAuth,
  checkRoleUserFile,
  fileController.deleteFileById
);
//
module.exports = router;
