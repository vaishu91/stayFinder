const Listing = require("../Model/listing.js");
const Review = require("../Model/reviews.js")


// Create Review
module.exports.createReview = async(req,res) => {
    console.log(req.params.id);
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    // console.log("new review");
    // res.send("new review saved");

    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${listing._id}`);
};


// Delete Review
module.exports.destroyReview = async (req,res,next) => {
    let {id,reviewId} = req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
};