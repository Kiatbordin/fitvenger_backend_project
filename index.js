const express = require("express");
const { default: mongoose } = require("mongoose");
const app = express();

const morgan = require("morgan");

const PORT = process.env.PORT || 3000;

const UserRouter = require("./routes/UserRouter");

// Middleware
app.use(morgan('dev'),express.json());
app.use("/user",UserRouter);
require("dotenv").config();

const start = async() => {
    await mongoose.connect(
        process.env.DB_URI
    );
    app.listen(PORT,()=>{
        console.log(`Server is starting on port ${PORT}.`);
    });
}

start();
