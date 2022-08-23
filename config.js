require("dotenv").config();

const config = {
    port : +process.env.PORT || 3000,
    mongodb : {
        uri : process.env.DB_URI
    },
    origin : process.env.ORIGIN,
    isVercel: process.env.IS_VERCEL || false,
    session_key : process.env.SESSION_KEY,
    session_secure : process.env.SESSION_SECURE,
    session_samesite : process.env.SESSION_SAMESITE
}

module.exports = config;