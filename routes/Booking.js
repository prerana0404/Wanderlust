const express = require("express");
const router = express.Router();
const Booking = require("../models/book");
const Listing = require("../models/listing");
const { isLoggedIn } = require("../middleware");

// Create a new booking
router.post("/:listingId/book", isLoggedIn, async (req, res) => {
    try {
        const { checkInDate, checkOutDate } = req.body;
        const listing = await Listing.findById(req.params.listingId);

        if (!listing) {
            return res.status(404).json({ error: "Listing not found" });
        }

        // Calculate total price
        const totalDays = Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24));
        const totalPrice = totalDays * listing.price;

        const booking = new Booking({
            user: req.user._id,
            listing: listing._id,
            checkInDate,
            checkOutDate,
            totalPrice,
            status: "pending"
        });

        await booking.save();
        res.redirect("/bookings/my-bookings");
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Get user bookings
router.get("/my-bookings", isLoggedIn, async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id }).populate("listing");
        res.render("bookings/index", { bookings });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
