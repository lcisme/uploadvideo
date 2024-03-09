require("dotenv").config();
const Sequelize = require('sequelize');

const express = require("express");
const bodyParser = require("body-parser");
const userRouter = require("./src/routes/userRoutes");
const fileRouter = require("./src/routes/fileRoutes");
const upLoadVideo = require("./src/uploadvideo");
const db = require("./src/database/models");
const cron = require("node-cron");

const app = express();
const port = process.env.PORT;



// db.sequelize
//   .sync({ force: true })
//   .then(() => {
//     console.log("Synced db.");
//   })
//   .catch((err) => {
//     console.log("Failed to sync db: " + err.message);
//   });

db.sequelize
  .sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/v1/users", userRouter);
app.use("/v1/files", fileRouter);

app.use("/", upLoadVideo);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: err.message
  });
});




app.post("/files/:fileId/moveToTrash", async (req, res) => {
  const fileId = req.params.fileId;
  console.log(fileId);
  try {
    await moveToTrash(fileId);
    return res.status(200).json({ message: "File moved to trash successfully" });
  } catch (error) {
    console.error("Error moving file to trash:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

const File = db.File;

const moveToTrash = async (fileId) => {
  const now = new Date();
  const delayTimeInMs = 5 * 60 * 1000; // 5 phút
  const deleteTime = new Date(now.getTime() + delayTimeInMs);
  await File.update({ status: 1, deletedAt: deleteTime }, { where: { id: fileId } });
};

const deleteFilesInTrash = async () => {
  const now = new Date();
  const filesInTrash = await File.findAll({ where: { status: 1, deletedAt: { [Sequelize.Op.lt]: now } } });

  for (const file of filesInTrash) {
    await file.destroy();
    console.log(`File with ID ${file.id} has been deleted from trash.`);
  }
};

cron.schedule("*/5 * * * *", async () => {
  try {
    await deleteFilesInTrash();
    console.log("Files in trash have been deleted.");
  } catch (error) {
    console.error("Error deleting files in trash:", error);
  }
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
