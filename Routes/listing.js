const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingControllers = require("../controller/listings.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });// used to give folder initially

// Combine Index and Create Route
router
    .route("/")
    .get(wrapAsync(listingControllers.index)) //Index 
    .post(
        isLoggedIn, 
        upload.single('listing[image]'),//multer will process
        validateListing, 
        wrapAsync(listingControllers.createListing)
    );

// New Route
router.get("/new", isLoggedIn, listingControllers.renderNewForm);

// Combine show, Update and delete Route
router
    .route("/:id")
    .get(wrapAsync(listingControllers.showListing)) //show
    .put(isLoggedIn, isOwner, upload.single('listing[image]'),validateListing, wrapAsync(listingControllers.updateListing)) //Update
    .delete(isLoggedIn, isOwner, wrapAsync(listingControllers.destroyListing) //delete
    );

// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingControllers.editListing));

module.exports = router;