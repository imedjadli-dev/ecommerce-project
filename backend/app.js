const express = require("express");
const fileUpload = require("express-fileupload");
const errorMiddleware = require("./middlewares/errors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const app = express();
const morgan = require("morgan");

app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));

const coupon = require("./routes/coupon");
app.use("/api/v1", coupon);

const blogs = require("./routes/blog");
app.use("/api/v1", blogs);

const products = require("./routes/product");
app.use("/api/v1", products);

const categories = require("./routes/category");

app.use("/api/v1", categories);

const user = require("./routes/user");
app.use("/api/v3", user);
const order = require("./routes/order");
app.use("/api/v4/", order);

app.use(fileUpload());
app.use(errorMiddleware);

module.exports = app;
