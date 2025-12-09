const app = require("./app");
const fileUpload = require("express-fileupload");

const connectDatabase = require("./config/database");
const http = require("http");
const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
app.use(express.urlencoded({ extended: true }));

const path = require("path");

// Serve avatar images from the avatars folder
app.use(express.static(path.join(__dirname, "public")));

// Configuration env file

const dotenv = require("dotenv");
dotenv.config({ path: "backend/config/config.env" });

app.use(fileUpload());

// Connection to Database
connectDatabase();

const server = app.listen(process.env.PORT, () => {
  console.log(
    `Server started on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode.`
  );
});
app.use("/avatar", express.static("public/avatar"));

process.on("unhandledRejection", (err) => {
  console.log(`ERROR: ${err.message}`);
  console.log("Shutting down, Unhandled Rejection");
  server.close(() => {
    process.exit(1);
  });
});

process.on("uncaughtException", (err) => {
  console.log(`ERROR: ${err.message}`);
  console.log("Shutting down,uncaught Exception ");
  process.exit(1);
});
