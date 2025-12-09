const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter product name"],
    trim: true,
  },

  price: {
    type: Number,
    required: [true, "Please enter the price"],
    min: [0, "Price must be greater than 0"],
  },

  description: {
    type: String,
    required: [true, "Please enter product description"],
    trim: true,
  },

  images: [
    {
      type: String,
      required: [true, "Please upload at least one image"],
    },
  ],

  ratings: {
    type: Number,
    default: 0,
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: [true, "Please select category"],
  },

  seller: {
    type: String,
    required: [true, "Please enter product seller"],
  },

  stock: {
    type: Number,
    required: [true, "Please enter product stock"],
    min: [0, "Stock cannot be negative"],
  },

  numOfReviews: {
    type: Number,
    default: 0,
  },

  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
      name: { type: String, required: true },
      rating: { type: Number, required: true },
      comment: { type: String, required: true },
      commentedAt: { type: Date, default: Date.now },
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", productSchema);
