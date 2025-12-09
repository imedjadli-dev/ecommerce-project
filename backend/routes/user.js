const express = require("express");
const path = require("path");
const router = express.Router();

const {
  registerUser,
  loginUser,
  logout,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updatePassword,
  updateProfile,
  getAllUsers,
  getUserDetails,
  updateUser,
  deleteUser,
} = require("../controllers/usersController");

const {
  isAuthentificationUser,
  authorizeRoles,
} = require("../middlewares/auth");

// Serve avatar files
router.get("/avatars/:filename", (req, res) => {
  const filePath = path.join(
    __dirname,
    "../public/avatars",
    req.params.filename
  );
  res.sendFile(filePath);
});

// Auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", isAuthentificationUser, logout);

// User profile
router.get("/me", isAuthentificationUser, getUserProfile);
router.put("/password/update", isAuthentificationUser, updatePassword);
router.put("/me/update", isAuthentificationUser, updateProfile);

// Password reset
router.post("/password/forgot", forgotPassword);
router.put("/password/reset/:token", resetPassword);

// Admin routes
router.get(
  "/admin/users",
  isAuthentificationUser,
  authorizeRoles("admin"),
  getAllUsers
);

router
  .route("/admin/user/:id")
  .get(isAuthentificationUser, authorizeRoles("admin"), getUserDetails)
  .put(isAuthentificationUser, authorizeRoles("admin"), updateUser)
  .delete(isAuthentificationUser, authorizeRoles("admin"), deleteUser);

module.exports = router;
