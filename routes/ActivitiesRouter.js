const { application } = require("express");
const express = require("express");
const router = express.Router({mergeParams:true}); // required UserId from parent's router

const activityController = require("../controllers/AcitivityController");

// test get all users activities , example path => /user/:userId/acitivities
// test get activities of unique user from start and end date, example path => /user/:userId/acitivities?start="$startDate"&end="$endDate"
router.get("/",activityController.getActivities); 

router.get("/:activityId",activityController.getActivityById); // test get an activity of unique user, example path => /user/:userId/acitivities/:activityId

router.post("/", activityController.createActivity);    // test create an activity of unique user , example path => /user/:userId/acitivities

router.put("/:activityId",activityController.editActivity);    //  // test edit an activity of unique user , example path => /user/:userId/acitivities/:activityId

router.delete("/:activityId",activityController.deleteActivity); // test delete an activity of unique user, example path => /user/:userId/acitivities/:activityId

module.exports = router;