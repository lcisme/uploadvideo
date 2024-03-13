const express = require("express");

const router = new express.Router();
const { checkAuth, checkRoleUserFile,checkRoleAdmin,checkRoleListUser,checkRoleCreateUser } = require("../authentication/checkAuth");

const fileController = require("../controllers/fileController");

// crud
router.get("/getAll", checkAuth, checkRoleAdmin, fileController.getAllFiles);
router.get("/getAllBy/:fileId", checkAuth, checkRoleListUser, fileController.getAllFilesById);
router.post("/upload", checkAuth, checkRoleCreateUser,fileController.createFile);
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
// view
router.get("/:viewFileUrl", checkAuth,  fileController.viewFile)
module.exports = router;
