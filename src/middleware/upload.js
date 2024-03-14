const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const { SIZEFILE, URL_PATH } = require("../config/constant");
const util = require("util");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + URL_PATH);
  },
  filename: (req, file, cb) => {
    const id = uuidv4();
    const ext = file.originalname.split(".").pop().toLowerCase();
    const newFileName = `${id}.${ext}`;
    cb(null, newFileName);
  },
});

const uploadFile = multer({
  storage: storage,
  limits: { fileSize: SIZEFILE },
}).single("nameFile");

const uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;
