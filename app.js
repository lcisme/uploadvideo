require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const userRouter = require("./src/routes/userRoutes");
const upLoadVideo = require("./src/uploadvideo");
const db = require("./src/database/models");

const app = express();
const port = process.env.PORT;

// Kết nối đến cơ sở dữ liệu bằng Sequelize
// const sequelize = new Sequelize(databaseUrl);

// Kiểm tra kết nối cơ sở dữ liệu
// sequelize.authenticate()
//   .then(() => {
//     console.log('Connection ok.');
//   })
//   .catch(err => {
//     console.error('Connection fail: ', err);
//   });

db.sequelize
  .sync({ force: true })
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

// Sử dụng middleware để xử lý dữ liệu từ request
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Sử dụng router cho đường dẫn "/v1/users"
app.use("/v1/users", userRouter);

// Sử dụng middleware cho đường dẫn gửi video
app.use("/", upLoadVideo);

// Lắng nghe các kết nối tới cổng đã chỉ định
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
