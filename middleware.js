const Listing = require("./Model/listing");
const Review = require("./Model/reviews");
const {listingSchema, reviewSchema} = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");

module.exports.isLoggedIn = (req,res,next) => {
    // console.log(req.path, "..", req.originalUrl);
    req.session.redirectUrl = req.originalUrl;
    if(!req.isAuthenticated()){
        req.flash("error", "you must logged in to create listing!");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

// Owner Authorization
module.exports.isOwner = async(req, res, next) => {
    let {id} = req.params;
    // console.log(id);
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","You are not Owner of this Listing");
        return res.redirect(`/listings/${id}`);
    }

    next();
}

// Validate Listings
module.exports.validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
};

// Review author Authentication
module.exports.isReviewAuthor = async(req, res, next) => {
    let {id, reviewId} = req.params;
    // console.log(id);
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You are not Author of this Review");
        return res.redirect(`/listings/${id}`);
    }

    next();
}

// Validate Reviews
module.exports.validateReview = (req,res,next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
};