const UsersModel = require("../models/UserModel").usersModel; // import User Schema
const bcrypt = require("bcryptjs");

/* Check username and password using plaintext */
const checkLogin = async(req,res,next) => {
    // console.log('checkLogin');
    try {
        /* Get user input */
        const { username,password } = req.body;
        // console.log(`username:${username} and password:${password}`);
        /* Validate user input */
        if(!(username && password)) {
            res.status(400).send("Username and password are required");
        }
        /* Validate if username and password correct in our database */
        const user = await UsersModel.findOne(
            {username,password},
            {activities:0,__v: 0}
        )
        // console.log(user);
        
        if(user) {
            // res.status(200).send(user._id);
            res.status(200).send(user);
        } else {
            res.status(400).send("Invalid Credentials");
        }

    } catch (err) {
        console.log(err);
    }
};

/* Check username and password using bcrypt */
const checkLogin2 = async(req,res,next) => {
    try {
        /* Get user input */
        const { username,password } = req.body;
        /* Validate user input */
        if(!(username && password)) {
            res.status(400).send("Username and password are required");
        }
        /* Validate if username and password correct in our database */
        const user = await UsersModel.findOne({username});
        
        if(user) {
            const isMatch = await bcrypt.compare(password,user.password);

            if(isMatch){
                console.log(user._id)
                console.log("Request Session:")
                req.session.user_id = user._id.toString();
                console.log(req.session);

                return res.status(200).send(user);
            } else {
                return res.status(400).send("Invalid Credentials");
            }

        } else {
            return res.status(400).send("Invalid Credentials");
        }

    } catch (err) {
        console.log(err);
    }
    
}

module.exports = {
    checkLogin,
    checkLogin2
};