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
    if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "File size too large" });
    }

    if (err) {
      return res.status(500).json({ error: "faillll" });
    }

    if (!req.file) {
      return res.status(400).json({ err: "Upload video pleaseeeee" });
    }
    const fileVideo = req.file.originalname.split(".").pop().toLowerCase();

    if (!checkfileVideo.includes(fileVideo)) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: "Invalid file type" });
    }

    const upLoadedVideo = req.file.filename;
    return res.status(200).json({
      statusCode: res.statusCode,
      message: "Upload file success",
      data: {
        videoURL: `${req.protocol}://${req.hostname}:${port}/${upLoadedVideo}`,
      },
    });
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

  if (!fileDelete) {
    res.json({
      statusCode: res.statusCode,
      message: `File with ID ${id} not found`,
    });
  }

  fs.unlinkSync(path.join(__dirname, "uploads", fileDelete));
  res.json({
    statusCode: res.statusCode,
    message: `File ${fileDelete} deleted successfully`,
  });
});

module.exports = router;
