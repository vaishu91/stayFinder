const Listing = require("../Model/listing.js");

// Index 
module.exports.index = async(req,res) => {
    const allListings = await Listing.find({});
    res.render("index.ejs",{allListings});
};

// New
module.exports.renderNewForm = (req,res) => {
    res.render("new.ejs");
};

// Show
module.exports.showListing = async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews", populate:{
        path: "author",
    }}).populate("owner");
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    res.render("show.ejs", {listing});
};

// Create
module.exports.createListing = async (req,res,next) => {
    // let {title,description,image,price,country,location}====>
    // if we haven't declare all these variable in new.ejs form in Listing[title] format. 
    // Making variables already an obj field/key
    // -------------This is a traditional method of validation
    // if(!req.body.listing){
    //     throw new ExpressError(404, "Send Valid Data!!");
    // }
    let url = req.file.path;
    let filename = req.file.filename;
    
    const newListing = new Listing(req.body.listing);//creating instance of listing
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

// Edit
module.exports.editListing = async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250,h_150/e_blur:100");
    res.render("edit.ejs", {listing, originalImageUrl});
};

// Update
module.exports.updateListing = async (req,res) => {
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});

    if(typeof(req.file) !== "undefined"){
       let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save(); 
    }

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

// Delete
module.exports.destroyListing = async (req,res) => {
    let {id} = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};