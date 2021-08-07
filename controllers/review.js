const Review = require("../models/review");
const Product = require("../models/product");

module.exports.createReview = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  const review = await new Review(req.body.review);
  review.author = req.user._id;
  product.reviews.push(review);
  await review.save();
  await product.save();
  req.flash("success", "Successfully added a review");
  res.redirect(`/products/${req.params.id}`);
};

module.exports.destroy = async (req, res) => {
  const { reviewId, id } = req.params;
  await Review.findByIdAndDelete(reviewId);
  await Product.findByIdAndUpdate(id, {
    $pull: { reviews: reviewId },
  });
  req.flash("error", "Successfully deleted a review");
  res.redirect(`/products/${id}`);
};
