if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}
// console.log(process.env.SECRET); 

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./Model/user.js");

const listingRouter = require("./Routes/listing.js");
const reviewRouter = require("./Routes/review.js");
const userRouter = require("./Routes/user.js");

const MongoURL = "mongodb://127.0.0.1:27017/wanderlust";//creating database

main().then(() => {
    console.log("Connected to DB");
}).catch((err) => {
    console.log(err);
});

async function main(){
    await mongoose.connect(MongoURL);
}


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname, "public")));// to use static folders

const sessionOption = {
    secret: "Vaishu@123",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, //(days*hrs*min*sec*milisec)
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    },
}

// app.get("/", (req,res) => {
//     // console.dir(req.cookies);
//     res.send("Hi I am root.");
// });

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize()); //after each request
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// // Demo User
// app.get("/demouser", async(req,res) => {
//     let fakeUser = new User({
//         email: "anc@gmail.com",
//         username: "Abc",
//     });

//     let registeredUser = await User.register(fakeUser, "hello");//Static method
//     res.send(registeredUser);
// });

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.all("*", (req,res,next) => {
    next(new ExpressError(404, "Page Not Found!!"));
});

// Error Handling Middleware
app.use((err,req,res,next) => {
    let {statuscode=500,message="Something Went Wrong!!"} = err;
    // res.status(statuscode).send(message);
    res.status(statuscode).render("error.ejs", {message});
});

app.listen(8080, () => {
    console.log("Server is listening at port 8080");
});

// cookies ----------> code expected after ["app.use("/listings/:id/reviews", reviews);"]
// app.get("/getsignedcookie", (req,res) => {
//     res.cookie("madeIn", "India", {signed : true});
//     res.cookie("color", "red", {signed : true});
//     res.send("signed cookie");
// });

// app.get("/verify", (req,res) => {
//     console.log(req.signedCookies);
//     res.send("verified");
// })

// Add Sample Data:
// app.get("/testListing", async (req,res) => {
//     let sampList = new Listing({
//         title:"My New Villa",
//         description:"By the beach",
//         price : 1200,
//         location : "Calangute, Goa",
//         country : "India",
//     });

//     await sampList.save();
//     console.log("Sample was Saved");
//     res.send("Successful testing");
// })