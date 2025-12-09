const Coupon = require("../models/coupon");

class CouponService {
  // =========================
  // FIND BY CODE
  // =========================
  static async findByCode(code) {
    return Coupon.findOne({ code });
  }

  // =========================
  // CREATE
  // =========================
  static async createCoupon(data) {
    const coupon = new Coupon(data);
    return coupon.save();
  }

  // =========================
  // GET ALL
  // =========================
  static async getAllCoupons() {
    return Coupon.find();
  }

  // =========================
  // GET COUPON BY CODE
  // =========================
  static async getCouponByCode(code) {
    return Coupon.findOne({ code });
  }

  // =========================
  // INCREMENT USAGE COUNT
  // =========================
  static async incrementUsageCount(code) {
    return Coupon.findOneAndUpdate(
      { code },
      { $inc: { usedCount: 1 } },
      { new: true }
    );
  }

  // =========================
  // GET SINGLE BY ID
  // =========================
  static async getCouponById(id) {
    return Coupon.findById(id);
  }

  // =========================
  // UPDATE
  // =========================
  static async updateCoupon(id, data) {
    return Coupon.findByIdAndUpdate(
      id,
      {
        code: data.code,
        discount: data.discount,
        usageLimit: data.usageLimit,
      },
      {
        new: true,
        runValidators: true,
      }
    );
  }

  // =========================
  // DELETE
  // =========================
  static async deleteCoupon(id) {
    const coupon = await Coupon.findById(id);
    if (!coupon) return null;

    await coupon.deleteOne();
    return coupon;
  }
}

module.exports = CouponService;
