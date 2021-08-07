const express = require("express");
const { isLoggedIn, isReviewAuthor, validateReview } = require("../middleware");
const catchAsync = require("../utils/catchAsync");

const reviews = require("../controllers/review");
const router = express.Router({ mergeParams: true });

router.post("/", isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(reviews.destroy)
);

module.exports = router;
