const express = require("express");
const router = express.Router();

const {
  createBlog,
  getAllBlogs,
  getSingleBlog,
  updateBlog,
  deleteBlog,
  getAdminAllBlogs,
} = require("../controllers/blogController");

const {
  isAuthentificationUser,
  authorizeRoles,
} = require("../middlewares/auth");

// Public
router.get("/blogs", getAllBlogs);
router.get("/blogs/:id", getSingleBlog);

// Admin
router.post(
  "/admin/blog/new",
  isAuthentificationUser,
  authorizeRoles("admin"),
  createBlog
);

router
  .route("/admin/blog/:id")
  .put(isAuthentificationUser, authorizeRoles("admin"), updateBlog)
  .delete(isAuthentificationUser, authorizeRoles("admin"), deleteBlog);

router.get(
  "/admin/blogs",
  isAuthentificationUser,
  authorizeRoles("admin"),
  getAdminAllBlogs
);

module.exports = router;
