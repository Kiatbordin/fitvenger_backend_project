const express = require("express");
const session = require("express-session");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { default: mongoose } = require("mongoose");
const morgan = require("morgan");
const config = require("../config");

/*
When running on Vercel, Vercel will take express "app" exported from this file.
We do not have control over port and things that should be run before the app.listen()
eg. mongoose.connect(). So we should connect to mongodb before every request by adding middleware below
to ensure database is connected before our code trying to query the it.

Note: Create new connection to database before every request is not a good practice and can cause issues for some database.
 */

if (config.isVercel) {
    app.use( async(req,res,next)=>{
        await mongoose.connect(
            config.mongodb.uri
        );
        return next();
    })
}

app.use(cors({
    // origin: config.origin,
    origin: "http://127.0.0.1:5173",
    credentials: true,
    // allowedHeaders: ["Content-Type", "Authorization"],
}));

/* This session's middle ware will set session properties to our request object */
app.use(session({
    secret: config.session_key,
    resave: false, 
    saveUninitialized: false,
    cookie: {
        // secure: true,
        // httpOnly: true,
        sameSite: "none",
        // sameSite: true,
      },
}));

const UserRouter = require("../routes/UserRouter");
const LoginRouter = require("../routes/LoginRouter");

// Middleware
app.use(morgan('dev'),express.json({ limit:'10mb' }));
app.use("/user",UserRouter);
app.use("/login",LoginRouter);

module.exports = app;