const express = require("express");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();
const port = process.env.PORT;
const MAX_FILE_SIZE = 10 * 1024 * 1024;

const upload = multer({
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});
// const countUpLoad = 0;

router.post("/upload", (req, res) => {
  // req.db.query("SELECT role_id FROM user_role WHERE user_id = ?", [userId], (err, results, fields) => {
  //   if (err) {
  //     return res.status(500).json({ error: "Failed to retrieve user role" });
  //   }
  
  //   if (results.length === 0) {
  //     return res.status(403).json({ error: "User role not found" });
  //   }
  
  //   const userRoleId = results[0].role_id;
  //   if (userRoleId !== "ROLE_USER" && userRoleId !== "ROLE_ADMIN") { 
  //     return res.status(403).json({ error: "Unauthorized" });
  //   }
  // });
  

  upload.single("video")(req, res, (err) => {
    if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "File size too large" });
    }

    if (err) {
      return res.status(500).json({ error: "faillll" });
    }

    if (!req.file) {
      return res.status(400).json({ err: "Upload file pleaseeeee" });
    }

    const ext = req.file.originalname.split(".").pop().toLowerCase();
    const id = uuidv4();
    const fileName = `${id}.${ext}`;

    const fileData = {
      nameFile: fileName,
      status: 0,
      created_At: new Date(),
      updated_At: new Date(),
    };

    req.db.query("Insert into files Set ?",
      fileData,
      (err, results, fields) => {
        if (err) {
          return res
            .status(500)
            .json({ error: "Failed to save to database" + err });
        }
        const filedId = results.insertId;
        const videoURL = `${req.protocol}://${req.hostname}:${port}/${filedId}`;

        return res.status(200).json({
          statusCode: res.statusCode,
          message: "Upload file success",
          data: {
            filedId,
            videoURL,
          },
        });
      }
    );
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
