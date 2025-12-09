const express = require("express");
const router = express.Router();

const {
  getAllCategories,
  newCategory,
  getSingleCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const {
  isAuthentificationUser,
  authorizeRoles,
} = require("../middlewares/auth");

// Public
router.get("/categories", getAllCategories);

// Admin
router.post(
  "/category/new",
  isAuthentificationUser,
  authorizeRoles("admin"),
  newCategory
);

router
  .route("/category/:id")
  .get(isAuthentificationUser, authorizeRoles("admin"), getSingleCategory)
  .put(isAuthentificationUser, authorizeRoles("admin"), updateCategory)
  .delete(isAuthentificationUser, authorizeRoles("admin"), deleteCategory);

module.exports = router;
