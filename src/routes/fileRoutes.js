const express = require("express");

const router = new express.Router();
const {
  checkAuth,
  checkRoleUserFile,
  checkRoleAdmin,
  checkRoleListUser,
  checkRoleCreateUser,
  can,
} = require("../authentication/checkAuth");

const fileController = require("../controllers/fileController");
const { ROLE } = require("../config/constant");

// crud
router.get("/getAll", checkAuth, can(ROLE.ADMIN), fileController.getAllFiles);
router.get("/:viewFileUrl", fileController.viewFile);
router.get(
  "/getAllBy/:fileId",
  checkAuth,
  checkRoleListUser,
  fileController.getAllFilesById
);
router.post(
  "/upload",
  checkAuth,
  checkRoleCreateUser,
  fileController.createFile
);
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

router.use((req, res) => {
  res.status(404).json("Page not found");
});
// view
module.exports = router;
