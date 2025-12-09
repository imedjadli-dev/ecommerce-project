const UserService = require("../services/user.service");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const upload = require("../middlewares/upload.middleware");
const ErrorHandler = require("../utils/errorHandler");

// REGISTER USER
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  upload.single("avatar")(req, res, async (err) => {
    if (err) return next(new ErrorHandler("Avatar upload error", 400));

    const response = await UserService.registerUser(req);
    res.status(200).json(response);
  });
});

// LOGIN USER
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const response = await UserService.loginUser(req);
  res.status(200).json(response);
});

// FORGOT PASSWORD
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const response = await UserService.forgotPassword(req);
  res.status(200).json(response);
});

// RESET PASSWORD
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  const response = await UserService.resetPassword(req);
  res.status(200).json(response);
});

// USER PROFILE
exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {
  const response = await UserService.getUserProfile(req);
  res.status(200).json(response);
});

// UPDATE PASSWORD
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const response = await UserService.updatePassword(req);
  res.status(200).json(response);
});

// UPDATE PROFILE
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  upload.single("avatar")(req, res, async (err) => {
    if (err) return next(new ErrorHandler("Avatar upload error", 400));

    const response = await UserService.updateProfile(req);
    res.status(200).json(response);
  });
});

// LOGOUT
exports.logout = catchAsyncErrors(async (req, res, next) => {
  const response = await UserService.logout(req, res);
  res.status(200).json(response);
});

// ADMIN: GET ALL USERS
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const response = await UserService.getAllUsers();
  res.status(200).json(response);
});

// ADMIN: GET USER DETAILS
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const response = await UserService.getUserDetails(req.params.id);
  res.status(200).json(response);
});

// ADMIN: UPDATE USER
exports.updateUser = catchAsyncErrors(async (req, res, next) => {
  const response = await UserService.updateUser(req.params.id, req.body);
  res.status(200).json(response);
});

// ADMIN: DELETE USER
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const response = await UserService.deleteUser(req.params.id);
  res.status(200).json(response);
});
