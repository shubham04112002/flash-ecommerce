const { cloudinary } = require("../cloudinary/index.js");
const Product = require("../models/product.js");

module.exports.index = async (req, res) => {
  const products = await Product.find({});
  res.render("products/index", { products });
};

module.exports.createProduct = async (req, res) => {
  const product = new Product(req.body.product);
  product.author = req.user._id;
  product.images = req.files.map((file) => ({
    url: file.path,
    filename: file.filename,
  }));
  await product.save();
  req.flash("success", "Successfully created a product");
  res.redirect(`/products/${product._id}`);
};

module.exports.renderNewForm = (req, res) => {
  res.render("products/new");
};

module.exports.showProduct = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author" },
    })
    .populate("author");
  res.render("products/show", { product });
};

module.exports.renderEditForm = async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.render("products/edit", { product });
};

module.exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const imgs = req.files.map((file) => ({
    url: file.path,
    filename: file.filename,
  }));
  const product = await Product.findByIdAndUpdate(id, { ...req.body.product });
  product.images.push(...imgs);

  if (req.body.deleteImages) {
    // deleteImages ke andar filenames hai jinhe delete karna hai
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await product.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }

  await product.save();
  req.flash("success", "Successfully changed your product");
  res.redirect(`/products/${id}`);
};

module.exports.destroy = async (req, res) => {
  const { id } = req.params;
  await Product.findByIdAndDelete(id);
  req.flash("error", "Successfully deleted your product");
  res.redirect("/products");
};
