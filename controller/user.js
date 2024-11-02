const User = require("../Model/user.js");

// Render SignUp Form
module.exports.signUpForm = (req,res) => {
    res.render("users/signup.ejs");
};

// SignUp
module.exports.signUp = async(req,res) => {
    try{
        let {username, email, password} = req.body;
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser,password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if(err){
                return next(err);
            }
            req.flash("success", "Registeration Successful");
            res.redirect("/listings");
        });
    } catch(e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

// Render Login Form
module.exports.logInForm = (req,res) => {
    res.render("users/login.ejs");
};

// LogIn
module.exports.LogIn = async(req,res) => {
    req.flash("success", "Welcome back to StayFinders");
    let redirectUrl = res.locals.redirectUrl || "/Listings";//post-login page
    res.redirect(redirectUrl);
};

// LogOut
module.exports.logOut = (req,res) => {
    req.logout((err) => {
        if(err){
            return next(err);
        }
        req.flash("success", "Logged Out Successfully");
        res.redirect("/listings");
    });
};