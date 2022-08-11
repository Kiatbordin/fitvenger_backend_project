const { default: mongoose } = require("mongoose");

const UsersModel = require("../models/UserModel").usersModel; // import User Schema
const ActivityModel = require("../models/UserModel").activityModel; // import activity Schema

const getActivities = async(req,res,next) => {
    const { userId } = req.params ;

    try {
        /* Check if query string (from/to) has been received or not. */
        if( Object.entries(req.query).length>0 ) { 

            /* check if both start and end date received */
            if(req.query.from && req.query.to) {
                const { from, to } = req.query;
                // console.log(userId);
                console.log("From: "+ from + " To: " + to);
                /*
                    Note : 
                    - The date format in mongoDB has GMT+ which cannot use for testing.
                        - Eg. 2022-10-15T11:00:00.000+00:00
                    - Try use the format from node.js or browser for testing 
                        - Eg. 2022-10-15T11:00:00.000Z
                */

                const rangeActivities = await UsersModel.aggregate([
                    // Find matching documents with userId
                    {
                        $match : { 
                            /* while using the aggregate function we have to use the mongoose object to convert the _id as object */
                            _id : mongoose.Types.ObjectId(userId)
                        }
                    },
                    // Unpack the activities array
                    {
                        $unwind : "$activities"
                    },
                    // Find the activities from and to using given date
                    {
                        $match : {
                            "activities.start" : { 
                                $gte : new Date(from) ,
                                $lte : new Date(to)
                            }
                        }
                    },
                    // Projects only activities array
                    {
                        $project: {
                            _id : 0,
                            activities: 1
                        }
                    },
                    
                ])
                // console.log(rangeActivities);

                /* return the simple format */
                return res.send(rangeActivities.map( activity => activity.activities ));
            } else {
                return res.status(404).send("Please check start and end date.")
            }

        } else {
            /* Return all activites if no query string (from/to) date define. */
            console.log(req.query);
            const activities = await UsersModel.find(
                { _id: userId },                    //  Filter
                {   _id: 0, activities : 1 }        //  Projector
            );
            return (!activities[0].activities) ? 
            res.status(404).send("No created activity.") : res.send(activities[0].activities);
        }

    } catch (err) {
        return res.status(400).send("Something went wrong.");
    }
}

const getActivityById = async(req,res,next)=> {
    const { userId,activityId } = req.params;
    console.log(`userId:${userId} and activityId:${activityId}`);

    try {
        const activity = await UsersModel.findOne(
          { _id: userId },                          //  Filter
          {
            _id : 0,
            activities: {
              $elemMatch: { _id: activityId },
            }
          }                                         //  Projector
        );
        /* mongoDB still returning an empty array if the activityId is wrong. */
        return (!activity.activities || activity.activities.length == 0 ) ?
        res.status(404).send("Activity not found.")
        : res.send(activity.activities[0]);

    } catch (err) {
        console.log(err.message);
        return res.status(404).send("Activity not found.");
    }
};

const createActivity = async(req,res,next) => {
    const { userId } = req.params;

    const newActivity = new ActivityModel({...req.body});
    let validateResult = newActivity.validateSync();

    if(validateResult) {
        return res.status(400).send(validateResult.message);
    } else {
        try { 
            /* put the new acitvity to the user's array. */
            let result = await UsersModel.findOneAndUpdate(
                { _id: userId },
                { $push: { activities: {...req.body} }},
                { new: true }   //  to returnback the result's object for trouble shooting.
            )
            console.log(result);
            return res.send("New activity has been added to userId:"+result._id); // return the new object Id to user.
        } catch (err) {
            return res.status(404).send(err.message);
        }
    }
};

const editActivity = async(req,res,next) => {
    const { userId,activityId } = req.params;
    console.log(`userId:${userId} and activityId:${activityId}`);

    try {
        /*  Find existing one first  */
        const existingActivity = await UsersModel.findOne(
            { _id: userId },                          //  Filter
            {
                _id : 0,
                activities: {
                    $elemMatch: { _id: activityId },
              }
            }                                         //  Projector
          );
        /* if string length isn't match, mongoose will go to catch immediately
        if string length match but value isn't match, mongoose will return empty array */
        if(!existingActivity.activities || existingActivity.activities.length == 0) {
            return res.status(404).send("Activity not found.")
        }
        /*  Merge existing one and new one */
        const existingActivityItem = existingActivity.activities[0];
        const mergeObject = {...existingActivityItem._doc, ...req.body};
        console.log(mergeObject);
        /*  find and updating merged object to database. */
        let result = await UsersModel.findOneAndUpdate(
            { 
                _id: userId,
                activities: {
                    $elemMatch: { _id: activityId },
                }
            },                              //  Filter
            {
                $set: {
                    "activities.$.topic" : mergeObject.topic,
                    "activities.$.type" : mergeObject.type,
                    "activities.$.start" : mergeObject.start,
                    "activities.$.end" : mergeObject.end,
                    "activities.$.location" : mergeObject.location,
                    "activities.$.status" : mergeObject.status,
                    "activities.$.description" : mergeObject.description,
                    "activities.$.score" : mergeObject.score,
                }
            },                              //  Setter
            { 
                new: true
            }   //  to returnback the result's object for trouble shooting.
        )
        console.log(result);
        return res.status(204).send(`The activityId:${mergeObject._id} has been updated.`); // return the new object Id to user.
    } catch (err) {
        return res.status(404).send("Activity not found.")
    }
};

const deleteActivity = async(req,res,next) => {
    const { userId,activityId } = req.params;
    console.log(`userId:${userId} and activityId:${activityId}`);
    try {
        /* pull(remove) the activity out of the user's array. */
        let result = await UsersModel.findOneAndUpdate(
            { _id: userId },
            { $pull: { activities: { _id: activityId } }},
            { new: true },   //  to returnback the result's object for trouble shooting.
        )
        console.log(result);
        /* Problem : If no acitivtyId found, findOneAndUpdate's method still working and no err found. */
        return res.send("The activity has been removed from userId:"+result._id); // return the new object Id to user.

    } catch (err) {
        return res.status(404).send("Activity not found.");
    }
};

module.exports = {
    getActivities,
    getActivityById,
    createActivity,
    editActivity,
    deleteActivity
}