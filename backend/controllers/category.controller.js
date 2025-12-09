const CategoryService = require("../services/category.service");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");

// =======================
// CREATE CATEGORY
// =======================
exports.newCategory = catchAsyncErrors(async (req, res, next) => {
  const { name } = req.body;

  const categoryExists = await CategoryService.findByName(name);
  if (categoryExists) {
    return next(new ErrorHandler("Category already exists", 400));
  }

  const category = await CategoryService.createCategory(req.body);

  res.status(201).json({
    success: true,
    category,
  });
});

// =======================
// GET ALL CATEGORIES
// =======================
exports.getAllCategories = catchAsyncErrors(async (req, res) => {
  const categories = await CategoryService.getAllCategories();

  res.status(200).json({
    success: true,
    count: categories.length,
    categories,
  });
});

// =======================
// GET SINGLE CATEGORY
// =======================
exports.getSingleCategory = catchAsyncErrors(async (req, res, next) => {
  const category = await CategoryService.getCategoryById(req.params.id);

  if (!category) {
    return next(new ErrorHandler("No category found with this ID", 404));
  }

  res.status(200).json({
    success: true,
    category,
  });
});

// =======================
// UPDATE CATEGORY
// =======================
exports.updateCategory = catchAsyncErrors(async (req, res, next) => {
  const updated = await CategoryService.updateCategory(req.params.id, req.body);

  if (!updated) {
    return next(new ErrorHandler("Category not found", 404));
  }

  res.status(200).json({
    success: true,
    category: updated,
  });
});

// =======================
// DELETE CATEGORY
// =======================
exports.deleteCategory = catchAsyncErrors(async (req, res, next) => {
  const deleted = await CategoryService.deleteCategory(req.params.id);

  if (!deleted) {
    return next(new ErrorHandler(`Category not found: ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    msg: "Category and related products deleted",
  });
});
