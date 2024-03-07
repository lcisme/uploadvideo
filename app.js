require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const userRouter = require("./src/routes/userRoutes");
const upLoadVideo = require("./src/uploadvideo");
const db = require("./src/database/models");

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

app.use("/", upLoadVideo);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: err.message
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
