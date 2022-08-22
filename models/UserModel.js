const uniqueValidator = require("mongoose-unique-validator");

const mongoose = require("mongoose");
const { Schema } = mongoose;

const activitySchema = new Schema({
    // _id is automatically generate(uuid v4) by mongoDB
    topic : { type: String, min: 10, max: 50, required: true },
    type: { type: String, enum:[ 'running','walking','swimming','hiking','bicycling' ], required: true },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    location: { type: String, max: 50 },
    status: { type: String, min: 4, max: 10, required: true },
    description: { type: String, max: 240 },
    score: { type: Number, min: 0, max: 5, required: true }
});

const userSchema = new Schema({
    // _id is automatically generate(uuid v4) by mongoDB
    username : { type: String, min: 8, max: 12, required:true, unique: true },
    // password : { type: String, min: 8, max: 16, required:true, select:false },
    password : { type: String, min: 8, required:true },
    name : { type: String, min: 30, max: 50, required:true },
    height : { type: Number, min: 1, required:true },
    weight : { type: Number, min: 1, required:true },
    gender : { type: String, enum:['M','F'], required:true },
    age : { type: Number, min: 1, required: true },
    goal : { type: String, max: 240 },
    img : { type: String, min: 1 },
    activities : [ activitySchema ]
});

// Apply the uniqueValidator plugin to userSchema.
userSchema.plugin(uniqueValidator);

// const usersModel = new mongoose.model("Users",userSchema);
// module.exports = usersModel;

const usersModel = new mongoose.model("Users",userSchema);
const activityModel = new mongoose.model("Activitys",activitySchema);
module.exports = {
    usersModel,
    activityModel
}