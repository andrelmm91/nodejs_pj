// External Dependencies
const express = require("express");
const path = require("path");
const feedRoutes = require("./routes/feed");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

//Internal Dependencies
const { mongodbConnection } = require("./mongodb/mongodbConnection");

// Initialisers
app.use(bodyParser.json());
app.use("/images", express.static(path.join(__dirname, "images")));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, PATCH");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Routes
app.use("/feed", feedRoutes);

// Error handler
app.use((error, req, res, next) => {
  console.error(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message: message });
});

mongoose
  .connect(mongodbConnection + "?retryWrites=true")
  .then(() => {
    console.log("connected to mongoDB");
    app.listen(8080);
  })
  .catch((err) => {
    console.log(err);
  });
