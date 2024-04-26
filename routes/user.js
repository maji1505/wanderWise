const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");


const userController = require("../controllers/users.js"); //require controllers users

//render signup form
router.get("/signup", userController.renderSignupForm);

//sign up
router.post("/signup", wrapAsync(userController.signup));

//render login form
router.get("/login", userController.renderLoginForm);

//login
router.post(
    "/login", saveRedirectUrl,
    passport.authenticate("local", {         //passport.authenticate() middleware used to authenticate 
        failureRedirect: "/login",             //requesst means check password or username
        failureFlash: true
    }), userController.login);

//logout
router.get("/logout", userController.logout);

module.exports = router;