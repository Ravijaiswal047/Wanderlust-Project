const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../Models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middlewares.js");
const { index } = require("../controllers/listing.js");
const listingController = require("../controllers/listing.js");

const { listingSchema } = require("../schema.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// New Route :

router.get("/new", isLoggedIn, listingController.renderNewForm);

router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingController.createListing));


router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn, upload.single("listing[image]"),validateListing, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

// edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));


module.exports = router;