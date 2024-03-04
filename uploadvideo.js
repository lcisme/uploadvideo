const express = require("express");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const checkfileVideo = ["mp4", "avi", "mov", "mkv"];
require("dotenv").config();
const port = process.env.PORT;
const MAX_FILE_SIZE = 10 * 1024 * 1024;

const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, callback) => {
    const ext = file.originalname.split(".").pop().toLowerCase();
    const timestamp = Date.now();
    const id = Math.floor(Math.random() * 100);
    const uniqueFilename = `${id}_video${timestamp}.${ext}`;
    callback(null, uniqueFilename);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});

router.post("/upload", (req, res) => {
  upload.single("video")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.redirect(
          `${req.protocol}://${req.hostname}:${port}/?error=file_size`);
      }
    } else if (err) {
      return res.redirect(
        `${req.protocol}://${req.hostname}:${port}/?error=file_size`);
    }

    if (req.file) {
      const fileVideo = req.file.originalname.split(".").pop().toLowerCase();
      if (checkfileVideo.includes(fileVideo)) {
        const upLoadedVideo = req.file.filename;
        res.json({
          statusCode: res.statusCode,
          message: "Upload file success",
          data: {
            videoURL: `${req.protocol}://${req.hostname}:${port}/${upLoadedVideo}`,
          },
        });
      } else {
        res.redirect(`${req.protocol}://${req.hostname}:${port}/?error=file_type`);
        fs.unlinkSync(req.file.path);
      }
    }
  });
});

router.get("/:filename", (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, "uploads", filename);
  res.sendFile(filePath);
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const files = fs.readdirSync("./uploads");
  const fileDelete = files.find((file) => file.startsWith(`${id}_video`));
  if (fileDelete) {
    fs.unlinkSync(path.join(__dirname, "uploads", fileDelete));
    res.json({
      statusCode: res.statusCode,
      message: `File ${fileDelete} deleted successfully`,
    });
  } else {
    res.json({
      statusCode: res.statusCode,
      message: `File with ID ${id} not found`,
    });
  }
});

module.exports = router;
