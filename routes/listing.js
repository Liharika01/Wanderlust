const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");

const listingController = require("../controllers/listings.js");
const multer = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });


router
  .route("/")
  .get(wrapAsync(listingController.index ))
  .post(isLoggedIn, 
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.createListing)
  );

 

//new route
router.get("/new", isLoggedIn, listingController.renderNewForm );

router
   .route("/:id")
   .get(async(req, res)=>{
    let  {id} = req.params;
    const listing = await Listing.findById(id).populate("owner")
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    });

    console.log(listing.reviews);

    res.render("listings/show.ejs", { listing });
   })
   .get(wrapAsync(listingController.showListing))
   .put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))
   .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

//edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editListing));

module.exports = router;