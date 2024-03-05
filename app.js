const express = require("express");
const path = require("path");
const mysql = require("mysql2");
const upLoadVideo = require("./src/uploadvideo");

require("dotenv").config();

const app = express();
const port = 3000;

const connection = mysql.createConnection(process.env.DATABASE_URL);

connection.connect((err) => {
    if (err) {
      console.log("login fail", err);
      return;
    }
    console.log("success");
  });

app.use((req, res, next) => {
  req.db = connection;
  next();
});


app.use("/", upLoadVideo);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
