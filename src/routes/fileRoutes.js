const express = require("express");

const router = new express.Router();
const {
  checkAuth,
  validateParams,
  checkRoleUserFile,
  checkRoleListUser,
  checkRoleCreateUser,
  can,
} = require("../authentication/checkAuth");
const { validateSearch,validateUserById, validateFileById } = require("../controllers/validators/userValidator");
const fileController = require("../controllers/fileController");
const { ROLE } = require("../config/constant");

// crud
// router.get("/getAll", checkAuth, can(ROLE.ADMIN), fileController.getAllFiles);
router.get(
  "/getAll",
  checkAuth,
  can(ROLE.ADMIN),
  validateParams(validateSearch),
  fileController.searchFile
);

router.get("/view/:viewFileUrl", fileController.viewFile);
router.get(
  "/getAllBy/:userId",
  checkAuth,
  checkRoleListUser,
  validateParams(validateUserById),
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
  validateParams(validateFileById),
  fileController.getFileById
);

router.patch(
  "/:fileId",
  checkAuth,
  checkRoleUserFile,
  validateParams(validateFileById),
  fileController.updateFileById
);

router.use((req, res) => {
  res.status(404).json("Page not found");
});
// view
module.exports = router;
