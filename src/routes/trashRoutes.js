const express = require("express");
const router = new express.Router();
const { validateFileById } = require("../controllers/validators/userValidator");
const { validateParams } = require("../authentication/checkAuth");
const trashController = require("../controllers/trashController");

router.post(
  "/files/:fileId/",
  validateParams(validateFileById),
  trashController.moveToTrash
);

module.exports = router;
