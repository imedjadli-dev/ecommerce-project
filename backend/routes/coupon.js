const express = require("express");
const router = express.Router();

const {
  createCoupon,
  getAllCoupon,
  getCouponByCode,
  getSingleCoupon,
  updateCoupon,
  deleteCoupon,
} = require("../controllers/couponController");

const {
  isAuthentificationUser,
  authorizeRoles,
} = require("../middlewares/auth");

// Admin
router.post(
  "/admin/coupon/new",
  isAuthentificationUser,
  authorizeRoles("admin"),
  createCoupon
);

router.get(
  "/admin/coupons",
  isAuthentificationUser,
  authorizeRoles("admin"),
  getAllCoupon
);

router.get(
  "/admin/coupon/:id",
  isAuthentificationUser,
  authorizeRoles("admin"),
  getSingleCoupon
);

router.put(
  "/admin/coupon/:id",
  isAuthentificationUser,
  authorizeRoles("admin"),
  updateCoupon
);

router.delete(
  "/admin/coupon/:id",
  isAuthentificationUser,
  authorizeRoles("admin"),
  deleteCoupon
);

// User
router.get("/coupon/:code", isAuthentificationUser, getCouponByCode);

module.exports = router;
