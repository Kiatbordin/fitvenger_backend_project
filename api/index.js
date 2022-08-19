const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { default: mongoose } = require("mongoose");
const morgan = require("morgan");
const config = require("./config");


app.use(cors({
    origin: config.origin
}));

const UserRouter = require("./routes/UserRouter");
const LoginRouter = require("./routes/LoginRouter");

// Middleware
app.use(morgan('dev'),express.json());
app.use("/user",UserRouter);
app.use("/login",LoginRouter);

module.exports = app;