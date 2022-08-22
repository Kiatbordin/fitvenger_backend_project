const express = require("express");
const router = express.Router();

const activityRouter = require("./ActivitiesRouter");
router.use("/:userId/activities",activityRouter);

const userController = require("../controllers/UserController");

router.get("/",userController.getAllUsers );        // test get all users , example path => /user
router.get("/:userId",userController.getUserById);  // test get single user , example path => /user/:userId
router.post("/", userController.createUser2);        // test create user , example path => /user
router.put("/:userId", userController.editUser);    // test edit user , example path => /user/:userId
router.delete("/:userId", userController.deleteUser); // test delete single user , example path => /user/:userId

module.exports = router;