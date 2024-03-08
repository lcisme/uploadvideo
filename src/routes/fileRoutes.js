const express = require('express');
const multer = require('multer');
const upload = multer();

const router = new express.Router();
const {checkAuth, checkRoleUser, checkRolePremium , checkRoleAdmin} = require('../authentication/checkAuth');

const fileController = require('../controllers/fileController');


// crud
router.post("/upload", upload.single('nameFile'), fileController.createFile);
router.get("/getAll", fileController.getAllFiles);
router.get("/:fileId", fileController.getFileById);
router.patch("/:fileId", fileController.updateFileById);
// router.get("/:fileId", fileController.download);
router.delete("/:fileId", fileController.deleteFileById);

module.exports = router;
