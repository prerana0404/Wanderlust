const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/reviews.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController=require("../controllers/listings.js");

//Index route
router.get("/", wrapAsync(listingController.index));


//new Route
router.get("/new", isLoggedIn,(listingController.renderNewForm));


//Show Route

router.get("/:id",
  wrapAsync(listingController.showListing)
);

//Create Route
router.post(
  "/",
  isLoggedIn,
  validateListing,
  wrapAsync(listingController.createListing)

);

//Edit route

router.get("/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm));

//Update route
router.put("/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync (listingController.updateListing));

//DELETE route
router.delete("/:id",
  isOwner,
  isLoggedIn,
  wrapAsync(listingController.destroyListingListing));

module.exports = router;