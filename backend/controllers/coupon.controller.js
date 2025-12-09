const CouponService = require("../services/coupon.service");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");

// =======================
// CREATE COUPON
// =======================
exports.createCoupon = catchAsyncErrors(async (req, res, next) => {
  const { code, discount, usageLimit } = req.body;

  const existing = await CouponService.findByCode(code);
  if (existing) {
    return next(new ErrorHandler("Coupon already exists", 400));
  }

  await CouponService.createCoupon({ code, discount, usageLimit });

  res.status(201).json({
    success: true,
    message: "Coupon created successfully",
  });
});

// =======================
// GET ALL COUPONS
// =======================
exports.getAllCoupon = catchAsyncErrors(async (req, res) => {
  const coupons = await CouponService.getAllCoupons();

  res.status(200).json({
    success: true,
    count: coupons.length,
    coupons,
  });
});

// =======================
// GET COUPON BY CODE
// =======================
exports.getCouponByCode = catchAsyncErrors(async (req, res, next) => {
  const { code } = req.params;

  const coupon = await CouponService.getCouponByCode(code);

  if (!coupon) {
    return next(new ErrorHandler("Coupon code not found", 404));
  }

  if (coupon.usedCount >= coupon.usageLimit) {
    return next(new ErrorHandler("Coupon has reached its usage limit", 400));
  }

  const updatedCoupon = await CouponService.incrementUsageCount(code);

  res.status(200).json({
    success: true,
    coupon: updatedCoupon,
  });
});

// =======================
// GET SINGLE COUPON (ADMIN)
// =======================
exports.getSingleCoupon = catchAsyncErrors(async (req, res, next) => {
  const coupon = await CouponService.getCouponById(req.params.id);

  if (!coupon) {
    return next(new ErrorHandler("No coupon found with this ID", 404));
  }

  res.status(200).json({
    success: true,
    coupon,
  });
});

// =======================
// UPDATE COUPON (ADMIN)
// =======================
exports.updateCoupon = catchAsyncErrors(async (req, res, next) => {
  const updated = await CouponService.updateCoupon(req.params.id, req.body);

  if (!updated) {
    return next(new ErrorHandler("Coupon not found", 404));
  }

  res.status(200).json({
    success: true,
    coupon: updated,
  });
});

// =======================
// DELETE COUPON (ADMIN)
// =======================
exports.deleteCoupon = catchAsyncErrors(async (req, res, next) => {
  const deleted = await CouponService.deleteCoupon(req.params.id);

  if (!deleted) {
    return next(new ErrorHandler(`Coupon not found: ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    message: "Coupon deleted",
  });
});
