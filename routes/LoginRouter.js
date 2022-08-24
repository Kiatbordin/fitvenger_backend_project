const express = require("express");
const router = express.Router();
const loginController = require("../controllers/LoginController");

router.post("/",loginController.checkLogin2);
router.post("/logout", (req,res,next)=>{
    req.session.destroy();
    res.send("Logged out.");
});

module.exports = router;