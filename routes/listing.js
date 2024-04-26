const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const schemaValidate = require("../schemaerror/schema.js");
const ExpressError = require("../utils/ExpressError.js");
const { isLoggedin } = require("../middleware.js");
const { equal } = require("joi");
const { isOwner } = require("../middleware.js");
const listingController = require("../controllers/listings.js");  //require controllers listings
const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage });

let schemaError = (req, res, next) => {  //////////////////////validation for schema 
    console.log(req.body.title);
    let av = schemaValidate(req);
    if (av != 0) {
        next(av);
    }
    else {
        next();
    }
}

//index Route
router.get("/", wrapAsync(listingController.index));

//search country
router.get("/country",wrapAsync(listingController.country));

//category wise
router.get("/category/:id",wrapAsync(listingController.category));

//new Route 
//check user is loggedin edir form render
router.get("/new", isLoggedin, listingController.renderNewForm);

//  Create Route
router.post("/", isLoggedin,upload.single("image"),schemaError, wrapAsync(listingController.createListing));
// router.post("/",upload.single("image"),(req,res)=>{res.send(req.file)});

//show Route
router.get("/:id", wrapAsync(listingController.showListing)
);

// update: edit & update Route 
router.get("/:id/edit", isLoggedin, isOwner, wrapAsync(listingController.renderEditForm));
//update Route
router.put("/:id", isLoggedin, isOwner,upload.single("image"), schemaError,wrapAsync(listingController.updateListing));

//Delete Route
router.delete("/:id", isLoggedin, isOwner, wrapAsync(listingController.deleteListing));
module.exports = router;