const User = require("../models/user");
const Order = require("../models/order");
const ErrorHandler = require("../utils/errorHandler");
const sendToken = require("../utils/jwToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const fs = require("fs");

// REGISTER USER
exports.registerUser = async (req) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) throw new ErrorHandler("Email already exists", 400);

  const user = await User.create({
    name,
    email,
    password,
    avatar: req.file ? req.file.filename : "default-avatar.jpg",
  });

  return sendToken(user, 200);
};

// LOGIN
exports.loginUser = async (req) => {
  const { email, password } = req.body;

  if (!email || !password)
    throw new ErrorHandler("Please enter email and password", 400);

  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new ErrorHandler("Invalid email or password", 400);

  const match = await user.comparePassword(password);
  if (!match) throw new ErrorHandler("Invalid email or password", 400);

  return sendToken(user, 200);
};

// FORGOT PASSWORD
exports.forgotPassword = async (req) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) throw new ErrorHandler("User not found", 404);

  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.FRONTEND_URL}/api/v3/password/reset/${resetToken}`;
  const message = `Your password reset url is:\n\n${resetUrl}\n\n`;

  await sendEmail({
    email: user.email,
    subject: "Password recovery",
    message,
  });

  return { success: true, message: `Email sent to: ${user.email}` };
};

// RESET PASSWORD
exports.resetPassword = async (req) => {
  const hashed = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashed,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) throw new ErrorHandler("Reset token invalid or expired", 400);

  if (req.body.password !== req.body.confirmPassword)
    throw new ErrorHandler("Passwords do not match", 400);

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  return sendToken(user, 200);
};

// PROFILE
exports.getUserProfile = async (req) => {
  const user = await User.findById(req.user._id);
  return { success: true, user };
};

// UPDATE PASSWORD
exports.updatePassword = async (req) => {
  const user = await User.findById(req.user.id).select("+password");

  if (!(await user.comparePassword(req.body.oldPassword)))
    throw new ErrorHandler("Old password incorrect", 400);

  user.password = req.body.password;
  await user.save();

  return sendToken(user, 200);
};

// UPDATE PROFILE
exports.updateProfile = async (req) => {
  const data = {
    name: req.body.name,
    email: req.body.email,
    avatar: req.file ? req.file.filename : req.user.avatar,
  };

  const updated = await User.findByIdAndUpdate(req.user.id, data, {
    new: true,
    runValidators: true,
  });

  return { success: true, user: updated };
};

// LOGOUT
exports.logout = async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  return { success: true, message: "Logged out" };
};

// ADMIN: GET ALL USERS
exports.getAllUsers = async () => {
  const users = await User.find();
  return { success: true, users };
};

// ADMIN: GET USER DETAILS
exports.getUserDetails = async (id) => {
  const user = await User.findById(id);
  if (!user) throw new ErrorHandler(`User not found: ${id}`, 404);

  return { success: true, user };
};

// ADMIN: UPDATE USER
exports.updateUser = async (id, body) => {
  const data = {
    name: body.name,
    firstname: body.firstname,
    email: body.email,
    role: body.role,
  };

  await User.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  return { success: true };
};

// ADMIN: DELETE USER
exports.deleteUser = async (id) => {
  const user = await User.findById(id);
  if (!user) throw new ErrorHandler(`User not found: ${id}`, 404);

  await User.findByIdAndDelete(id);
  await Order.deleteMany({ user: id });

  if (user.avatar !== "default-avatar.jpg") {
    const path = `./backend/public/avatars/${user.avatar}`;
    if (fs.existsSync(path)) fs.unlinkSync(path);
  }

  return { success: true, message: "User deleted" };
};
