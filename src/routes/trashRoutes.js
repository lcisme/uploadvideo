const express = require("express");
const router = new express.Router();

const trashController = require("../controllers/trashController");

router.post("/files/:fileId/",trashController.moveToTrash);

module.exports = router