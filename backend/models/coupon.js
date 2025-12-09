const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, "Please enter coupon code"],
    unique: true,
  },

  discount: {
    type: Number,
    required: [true, "Please enter discount percentage"],
  },

  isActive: {
    type: Boolean,
    default: true,
  },

  usageLimit: {
    type: Number,
    required: [true, "Please enter usage limit"],
  },

  usedCount: {
    type: Number,
    default: 0,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Coupon", couponSchema);
