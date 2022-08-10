const UsersModel = require("../models/UserModel").usersModel; // import User Schema
const ActivityModel = require("../models/UserModel").activityModel; // import activity Schema

const getActivities = async(req,res,next) => {
    const { userId } = req.params ;
    console.log(Object.entries(req.query).length>0);

    try {
        /* Check if query string has been received or not. */
        if(Object.entries(req.query).length>0) { 
            // Return activities during the start and end dates.
            console.log('start and end date');
            console.log(req.query);

        } else {
            // Return all activites if not start and end date define.
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

const getActivitiesByDate = async(req,res,next)=>{
    console.log(req.query);
    res.send("Get by dates.");
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
        // mongoDB still returning an empty array if the activityId is wrong. 
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
            // put the new acitvity to the user's array.
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
        // pull(remove) the activity out of the user's array.
        let result = await UsersModel.findOneAndUpdate(
            { _id: userId },
            { $pull: { activities: { _id: activityId } }},
            { new: true },   //  to returnback the result's object for trouble shooting.
        )
        console.log(result);
        // Problem : If no acitivtyId found, findOneAndUpdate's method still working and no err found.
        return res.send("The activity has been removed from userId:"+result._id); // return the new object Id to user.

    } catch (err) {
        return res.status(404).send("Activity not found.");
    }
};

module.exports = {
    getActivities,
    getActivityById,
    getActivitiesByDate,
    createActivity,
    editActivity,
    deleteActivity
}