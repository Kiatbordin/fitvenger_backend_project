const mongoose = require("mongoose");
const app = require("./api/index.js");

const config = require("./config");

const start = async() => {
    await mongoose.connect(
        config.mongodb.uri
    );
    app.listen(config.port,()=>{
        console.log(`Server is starting on port ${config.port}.`);
    });
}

start();
