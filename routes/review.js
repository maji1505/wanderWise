const express = require("express");
const router = express.Router({ mergeParams: true });  //{mergeParams:true} this use for passing /:id
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const reviewValidate = require("../schemaerror/review.js");
const { isLoggedin, isReviewAuthor } = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");  //require controllers reviews

let reviewError = (req, res, next) => {  //////////////////////validation for review
   let av = reviewValidate(req);
   if (av != 0) {
      next(av);
   }
   else {
      next();
   }
}

//Reviews
//Reviews post Route
router.post("/", isLoggedin, reviewError, wrapAsync(reviewController.createReview));

//Delete review route
router.delete("/:reviewId", isLoggedin, isReviewAuthor, wrapAsync(reviewController.deleteReview));

module.exports = router;