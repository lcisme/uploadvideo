require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const userRouter = require("./src/routes/userRoutes");
const fileRouter = require("./src/routes/fileRoutes");
const trashRouter = require("./src/routes/trashRoutes");
const upLoadVideo = require("./src/uploadvideo");
const db = require("./src/database/models");
const cron = require("node-cron");
const Sequelize = require("sequelize");
const { BaseResponse } = require("./src/common/common");
const File = db.File;

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
app.use("/v1/moveToTrash", trashRouter);

// app.use("/", upLoadVideo);

app.use((err, req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  return BaseResponse.error(res, err.statusCode, err.message, err);
});

const deleteFilesInTrash = async () => {
  try {
    const now = new Date();
    await File.destroy({
      where: {
        status: 0,
        deletedAt: {
          [Sequelize.Op.lte]: now,
        },
      },
    });
    console.log("Files in trash have been deleted.");
  } catch (error) {
    console.error("Error deleting files in trash:", error);
  }
};


cron.schedule("* * * * *", async () => {
  try {
    await deleteFilesInTrash();
  } catch (error) {
    console.error("Error executing cron job:", error);
  }
});

cron.schedule("* * * * *", async () => {
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
