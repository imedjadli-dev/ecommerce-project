const express = require("express");
const router = express.Router();

const {
  getAdminProducts,
  getProducts,
  newProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getProductReviews,
  deleteProductReview,
} = require("../controllers/productController");

const {
  isAuthentificationUser,
  authorizeRoles,
} = require("../middlewares/auth");

// Public
router.get("/products", getProducts);
router.get("/product/:id", getSingleProduct);

// Admin
router.post(
  "/admin/product/new",
  isAuthentificationUser,
  authorizeRoles("admin"),
  newProduct
);

router.get(
  "/admin/products",
  isAuthentificationUser,
  authorizeRoles("admin"),
  getAdminProducts
);

router
  .route("/admin/product/:id")
  .put(isAuthentificationUser, authorizeRoles("admin"), updateProduct)
  .delete(isAuthentificationUser, authorizeRoles("admin"), deleteProduct);

// Reviews
router.put("/review", isAuthentificationUser, createProductReview);
router.get("/admin/reviews", isAuthentificationUser, getProductReviews);
router.delete("/admin/reviews", isAuthentificationUser, deleteProductReview);

module.exports = router;
