const Joi = require("joi");

module.exports.productSchema = Joi.object({
  product: Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required().min(10),
    // image: Joi.string().required(),
    description: Joi.string().required(),
  }).required(),
  deleteImages: Joi.array(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    body: Joi.string().required(),
  }).required(),
});
