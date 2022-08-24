const UsersModel = require("../models/UserModel").usersModel; // import User Schema
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require("uuid");

// admin only
const getAllUsers = async(req,res,next) => {
    try {
        const users = await UsersModel.find({},{ activities : 0 });
        return (!users || users.length==0) ? res.status(404).send("No users.") : res.send(users);
    } catch (err) {
        return res.status(400).send("Something went wrong.");
    }
}

const getUserById = async(req,res,next) => {

    let { userId } = req.params ;

    /* Check if user already had cookie's session */
    if(userId=="me") {
        /* For cookie session */
        console.log(req.session);
        userId = req.session.user_id;
    } 
        
    try {
      const user = await UsersModel.findOne({ _id: userId }, { activities: 0 });
      return !user ? res.status(404).send("User not found.") : res.send(user);
    } catch (err) {
      return res.status(404).send("User not found.");
    }

}

const createUser = async(req,res,next) => {
    const newUser = new UsersModel({ ...req.body });
    let validateResult = newUser.validateSync();
    // console.log(validateResult);

    if(validateResult) {
        return res.status(400).send(validateResult.message);
    } else {
        try {
            await newUser.save();
            // console.log(newUser);
            return res.send(newUser._id); // return the new object Id to user.
        } catch (err) {
            return res.status(400).send(err.message);
        }
    }
}

const createUser2 = async(req,res,next) => {

    const { password } = req.body;
    const hashedPassword = await bcrypt.hash(password,12);

    const newUser = new UsersModel({ ...req.body,password: hashedPassword  });
    // console.log(newUser);
    let validateResult = newUser.validateSync();

    if(validateResult) {
        return res.status(400).send(validateResult.message);
    } else {
        try {
            await newUser.save();
            return res.send(newUser._id); // return the new object Id to user.
        } catch (err) {
            return res.status(400).send(err.message);
        }
    }

}

const editUser = async(req,res,next) => {
    const { userId } = req.params ;
    try {
        let result = await UsersModel.findOneAndUpdate( {_id: userId },{...req.body}, {
            new: true
          });
        // console.log(result);
        return res.status(204).send("Information Updated");
    } catch (err) {
        return res.status(404).send("User not found.");
        // console.log(err);
    }
}

// admin only
const deleteUser = async(req,res,next) => {
    const { userId } = req.params ;
    try {
        const deleteUser = await UsersModel.deleteOne({_id:userId});
        return !deleteUser ? res.status(400).send("User not found.") : res.status(204).send("Deleted.");
    } catch (err) {
        return res.status(404).send("User not found.");
    }
}

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    createUser2,
    editUser,
    deleteUser
}