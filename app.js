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
const { BaseResponse, ApplicationError } = require("./src/common/common");
const fs = require("fs");
const path = require("path");
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
  // return BaseResponse.error(res, err.statusCode, err.message, err);
  return BaseResponse.error(res, err.statusCode || 500, err.message || "Internal Server Error", err);

});

const deleteFilesInTrash = async () => {
  try {
    const now = new Date();

    // Step 1: Get files need to delete in DB
    const files = await File.findAll({
      where: {
        status: 0,
        deletedAt: {
          [Sequelize.Op.lte]: now,
        },
      },
    });
    // Step 2: promiseall that files and delete file path in uploads folder
    // Promise.all
    // fs.unlinkSync();
    try {
      await Promise.all(
        files.map(async (file) => {
          const filePath = path.join(
            __dirname,
            "uploads",
            file.dataValues.nameFile
          );
          return  fs.unlinkSync(filePath);
        })
      );
    } catch (error) {
      return new ApplicationError(400, "Invalid token");
    }
    // STtep3: delete in db
    const fileIds = files.map((file) => file.id);
    await File.destroy({
      where: {
        id: fileIds,
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

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
