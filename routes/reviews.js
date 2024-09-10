const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/reviews.js");
const Expresserror = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {
    isLoggedIn, isReviewAuthor,
    validateReview,
} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");
//reviews
//post review  route

router.post("/",
    isLoggedIn,
    validateReview,
    wrapAsync(reviewController.createReview)

);

//DELETE review route
router.delete(
    "/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.destroyReview)
);
module.exports = router;