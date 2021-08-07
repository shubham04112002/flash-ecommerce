const mongoose = require("mongoose");
const { Schema } = mongoose;

const imageSchema = new Schema({
  url: String,
  filename: String,
});

imageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});

const productSchema = new Schema({
  name: {
    type: String,
  },

  price: {
    type: Number,
  },

  images: [imageSchema],

  description: {
    type: String,
  },

  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],

  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});
const Product = mongoose.model("Product", productSchema);
module.exports = Product;
