const Listing = require("../models/listing.js");
const Review = require("../models/review.js")

module.exports.createReview = async (req, res) => {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }

    // Create review
    const review = new Review(req.body.review);

    // Set author and listing
    review.author = req.user._id;
    review.listing = listing._id;

    // Save review first
    await review.save();

    // Add review ID to listing
    listing.reviews.push(review._id);

    // Save listing
    await listing.save();

    console.log("Review saved:", review);
    console.log("Review ID:", review._id);
    console.log("Listing reviews:", listing.reviews);

    req.flash("success", "New Review Created!");

    res.redirect(`/listings/${listing._id}`);
};

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
};