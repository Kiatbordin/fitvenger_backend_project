const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { default: mongoose } = require("mongoose");
const morgan = require("morgan");
const config = require("./config");


app.use(cors({
    origin: process.env.ORIGIN
}));

const UserRouter = require("./routes/UserRouter");

// Middleware
app.use(morgan('dev'),express.json());
app.use("/user",UserRouter);

const start = async() => {
    await mongoose.connect(
        config.mongodb.uri
    );
    app.listen(config.port,()=>{
        console.log(`Server is starting on port ${config.port}.`);
    });
}

start();
