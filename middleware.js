const Product = require("./models/product");
const Review = require("./models/review");
const { productSchema, reviewSchema } = require("./schema");
const ExpressError = require("./utils/ExpressError.js");

module.exports.validateProduct = (req, res, next) => {

  const { error } = productSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  

  if (error) {
   
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg);
  } else {
 
    next();
  }
};

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be logged in to do so");
    return res.redirect("/users/login");
  }
  next();
};

module.exports.isProductAuthor = async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product.author.equals(req.user._id)) {
    return res.redirect(`/products/${id}`);
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { reviewId, id } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    return res.redirect(`/products/${id}`);
  }
  next();
};
