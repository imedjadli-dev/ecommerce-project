const express = require("express");
const router = express.Router();

const {
  newOrder,
  getSingleOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} = require("../controllers/orderController");

const {
  isAuthentificationUser,
  authorizeRoles,
} = require("../middlewares/auth");

// User
router.post("/order/new", isAuthentificationUser, newOrder);
router.get("/order/:id", isAuthentificationUser, getSingleOrder);
router.get("/orders/me", isAuthentificationUser, getMyOrders);

// Admin
router.get(
  "/admin/orders",
  isAuthentificationUser,
  authorizeRoles("admin"),
  getAllOrders
);

router
  .route("/admin/order/:id")
  .put(isAuthentificationUser, authorizeRoles("admin"), updateOrderStatus)
  .delete(isAuthentificationUser, authorizeRoles("admin"), deleteOrder);

module.exports = router;
