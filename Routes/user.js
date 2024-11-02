const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");

const userController = require("../controller/user.js");

// Combine SignUp Form and SignedUp Route
router
    .route("/signup")
    .get(userController.signUpForm) //SignUp Form
    .post(wrapAsync(userController.signUp)
    ); //signedUp


// cobine Login form and logedIn Route
router  
    .route("/login")
    .get(userController.logInForm) //login Form
    .post(saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true}), userController.LogIn); //logedIn

// Logout Route
router.get("/logout", userController.logOut);

module.exports = router;