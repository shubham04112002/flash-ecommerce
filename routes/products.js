const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync.js");
const products = require("../controllers/products");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });
const {
  isLoggedIn,
  isProductAuthor,
  validateProduct,
} = require("../middleware");

router
  .route("/")
  .get(catchAsync(products.index))
  .post(
    isLoggedIn,
    upload.array("image"),
    validateProduct,
    catchAsync(products.createProduct)
  );

router.get("/new", isLoggedIn, products.renderNewForm);

router
  .route("/:id")
  .get(catchAsync(products.showProduct))
  .put(
    isLoggedIn,
    isProductAuthor,
    upload.array("image"),
    validateProduct,
    catchAsync(products.updateProduct)
  )
  .delete(isLoggedIn, isProductAuthor, catchAsync(products.destroy));

router.get(
  "/:id/edit",
  isLoggedIn,
  isProductAuthor,
  catchAsync(products.renderEditForm)
);

module.exports = router;
