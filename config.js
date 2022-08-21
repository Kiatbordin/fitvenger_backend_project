require("dotenv").config();

const config = {
    port : +process.env.PORT || 3000,
    mongodb : {
        uri : process.env.DB_URI
    },
    origin : process.env.ORIGIN,
    isVercel: process.env.IS_VERCEL || false,
}

module.exports = config;