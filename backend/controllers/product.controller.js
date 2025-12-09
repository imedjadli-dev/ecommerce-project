const ProductService = require("../services/product.service");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const upload = require("../middlewares/upload.middleware");
const ErrorHandler = require("../utils/errorHandler");

// CREATE PRODUCT
exports.newProduct = catchAsyncErrors(async (req, res, next) => {
  upload.array("images", 5)(req, res, async (err) => {
    if (err) return next(new ErrorHandler("Error uploading images", 400));

    const result = await ProductService.newProduct(req);
    res.status(201).json(result);
  });
});

// GET ALL PRODUCTS -  search/filter/pagination
exports.getProducts = catchAsyncErrors(async (req, res, next) => {
  const result = await ProductService.getProducts(req);
  res.status(200).json(result);
});

// GET SINGLE PRODUCT
exports.getSingleProduct = catchAsyncErrors(async (req, res, next) => {
  const result = await ProductService.getSingleProduct(req.params.id);
  res.status(200).json(result);
});

// UPDATE PRODUCT
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  upload.array("images", 5)(req, res, async (err) => {
    if (err) return next(new ErrorHandler("Image upload failed", 400));

    const result = await ProductService.updateProduct(req);
    res.status(200).json(result);
  });
});

// DELETE PRODUCT
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const result = await ProductService.deleteProduct(req.params.id);
  res.status(200).json(result);
});

// CREATE OR UPDATE REVIEW
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
  const result = await ProductService.createProductReview(req);
  res.status(200).json(result);
});

// GET PRODUCT REVIEWS
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const result = await ProductService.getProductReviews(req.query.id);
  res.status(200).json(result);
});

// DELETE REVIEW
exports.deleteProductReview = catchAsyncErrors(async (req, res, next) => {
  const result = await ProductService.deleteProductReview(req.query);
  res.status(200).json(result);
});

// ADMIN: ALL PRODUCTS
exports.getAdminProducts = catchAsyncErrors(async (req, res, next) => {
  const result = await ProductService.getAdminProducts();
  res.status(200).json(result);
});
