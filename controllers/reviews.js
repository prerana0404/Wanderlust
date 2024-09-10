const Listing = require("../models/listing");
const Review = require("../models/reviews");

module.exports.createReview = async (req, res) => {
    let {id}=req.params;
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    // console.log(newReview);
    listing.reviews.push(newReview);
    
    await listing.save();
    await newReview.save();
    console.log("new review saved:");
    req.flash("success", "New Reviwe Created: ");
   res.redirect(`/listings/${id}`);

   // res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Reviwe Deleted: ");

    res.redirect(`/listings/${id}`);
};
