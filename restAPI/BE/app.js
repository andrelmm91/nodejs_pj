// External Dependencies
const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const app = express();
const helmet = require("helmet");
const morgan = require("morgan");

//Internal Dependencies
const feedRoutes = require("./routes/feed");
const authRoutes = require("./routes/auth");

const { mongodbConnection } = require("./mongodb/mongodbConnection");
//Image storage
const FileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4());
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// Initialisers
app.use(bodyParser.json());
app.use(
  multer({ storage: FileStorage, fileFilter: fileFilter }).single("image")
);
app.use("/images", express.static(path.join(__dirname, "images")));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, DELETE, PATCH, PUT"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// security of headers
app.use(helmet());
//Logging
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flag: "a" }
);
app.use(morgan("combined", { stream: accessLogStream }));

// Routes
app.use("/feed", feedRoutes);
app.use("/auth", authRoutes);

// Error handler
app.use((error, req, res, next) => {
  console.error(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

//connect to database and listen to port
mongoose
  .connect(mongodbConnection + "?retryWrites=true")
  .then(() => {
    console.log("connected to mongoDB");
    app.listen(process.env.BE_PORT || 8080);
  })
  .catch((err) => {
    console.log(err);
  });
