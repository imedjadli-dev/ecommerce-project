const Product = require("../models/product");
const Category = require("../models/category");
const ErrorHandler = require("../utils/errorHandler");
const APISearch = require("../utils/apiSearch");
const fs = require("fs");

// ----------------------------
// CREATE PRODUCT
// ----------------------------
exports.newProduct = async (req) => {
  const { name, price, stock, seller, category, description } = req.body;

  const categoryObj = await Category.findOne({ name: category });
  if (!categoryObj) throw new ErrorHandler("Invalid category", 400);

  const images = req.files ? req.files.map((f) => f.filename) : [];

  const product = await Product.create({
    name,
    price,
    stock,
    seller,
    category,
    description,
    images,
  });

  categoryObj.products.push(product._id);
  await categoryObj.save();

  return {
    success: true,
    product,
  };
};

// ----------------------------
// GET ALL PRODUCTS (SEARCH + PAGINATION)
// ----------------------------
exports.getProducts = async (req) => {
  const productsCount = await Product.countDocuments();

  const resPerPage = 12;

  const apiSearch = new APISearch(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resPerPage);

  const products = await apiSearch.query;

  return {
    success: true,
    productsCount,
    resPerPage,
    message: "All products",
    products,
  };
};

// ----------------------------
// GET SINGLE PRODUCT
// ----------------------------
exports.getSingleProduct = async (id) => {
  const product = await Product.findById(id);
  if (!product) throw new ErrorHandler("Product not found", 404);

  return {
    success: true,
    product,
  };
};

// ----------------------------
// UPDATE PRODUCT
// ----------------------------
exports.updateProduct = async (req) => {
  const { name, price, stock, seller, category, description } = req.body;
  const product = await Product.findById(req.params.id);

  if (!product) throw new ErrorHandler("Product not found", 404);

  // If images uploaded: delete old ones
  if (req.files && req.files.length > 0) {
    product.images.forEach((image) => {
      const path = `./backend/public/products/${image}`;
      if (fs.existsSync(path)) fs.unlinkSync(path);
    });
  }

  const images =
    req.files && req.files.length > 0
      ? req.files.map((f) => f.filename)
      : product.images;

  const updated = await Product.findByIdAndUpdate(
    req.params.id,
    { name, price, stock, seller, category, description, images },
    {
      new: true,
      runValidators: true,
    }
  );

  return {
    success: true,
    message: "Product updated",
    product: updated,
  };
};

// ----------------------------
// DELETE PRODUCT
// ----------------------------
exports.deleteProduct = async (id) => {
  const product = await Product.findById(id);
  if (!product) throw new ErrorHandler("Product not found", 404);

  product.images.forEach((image) => {
    const path = `./backend/public/products/${image}`;
    if (fs.existsSync(path)) fs.unlinkSync(path);
  });

  await product.deleteOne();

  return {
    success: true,
    message: "Product removed",
  };
};

// ----------------------------
// CREATE OR UPDATE PRODUCT REVIEW
// ----------------------------
exports.createProductReview = async (req) => {
  const { rating, comment, productId } = req.body;

  const product = await Product.findById(productId);
  if (!product) throw new ErrorHandler("Product not found", 404);

  const existingReview = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );

  if (existingReview) {
    existingReview.comment = comment;
    existingReview.rating = rating;
    existingReview.commentedAt = Date.now();
  } else {
    product.reviews.push({
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
      commentedAt: Date.now(),
    });
    product.numOfReviews = product.reviews.length;
  }

  product.ratings =
    product.reviews.reduce((sum, r) => sum + r.rating, 0) /
    product.reviews.length;

  await product.save({ validateBeforeSave: false });

  return { success: true };
};

// ----------------------------
// GET PRODUCT REVIEWS
// ----------------------------
exports.getProductReviews = async (productId) => {
  const product = await Product.findById(productId);
  if (!product) throw new ErrorHandler("Product not found", 404);

  return {
    success: true,
    reviews: product.reviews,
  };
};

// ----------------------------
// DELETE PRODUCT REVIEW
// ----------------------------
exports.deleteProductReview = async (query) => {
  const product = await Product.findById(query.productId);
  if (!product) throw new ErrorHandler("Product not found", 404);

  const reviews = product.reviews.filter(
    (review) => review._id.toString() !== query.id.toString()
  );

  const numOfReviews = reviews.length;

  const ratings =
    numOfReviews === 0
      ? 0
      : reviews.reduce((acc, item) => item.rating + acc, 0) / numOfReviews;

  await Product.findByIdAndUpdate(
    query.productId,
    {
      reviews,
      numOfReviews,
      ratings,
    },
    { new: true, runValidators: true }
  );

  return { success: true };
};

// ----------------------------
// ADMIN: GET ALL PRODUCTS
// ----------------------------
exports.getAdminProducts = async () => {
  const products = await Product.find();

  return {
    success: true,
    products,
  };
};
