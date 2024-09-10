const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    // console.log(allListings);
    res.render("listings/index.ejs", { allListings });

};

module.exports.renderNewForm = (req, res) => {
    // console.log(req.user);
    res.render("listings/new.ejs");
};


module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({  //neasted populate
            path: "reviews",
            populate: {
                path: "author",
            },
        })
        .populate("owner");
    if (!listing) {
        req.flash("error", "listing you requested does not exist: ");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });

};

module.exports.createListing = async (req, res, next) => {
    let result = listingSchema.validate(req.body);
    console.log(result);
    if (result.error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new Expresserror(400, errMsg);
    }

    //let{title,description,image,price,country,location}=req.body
    //   let listing=req.body.listing;
    //   console.log(listing);

    const newListing = new Listing(req.body.listing);
    // console.log(req.user);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New listing Created: ");
    res.redirect("/listings");
    ///next(err);
};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "listing you requested does not exist: ");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
};

module.exports.updateListing=async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing Updated: ");
    res.redirect(`/listings/${id}`);
  };


  module.exports.destroyListing=async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", " listing Deleted: ");
    res.redirect("/listings");
  }