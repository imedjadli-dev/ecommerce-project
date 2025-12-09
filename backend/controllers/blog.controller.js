const BlogService = require("../services/blog.service");
const { createUpload } = require("../middlewares/upload.middleware");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const APISearch = require("../utils/apiSearch");

const uploadBlogImages = createUpload({
  folder: "backend/public/blogs",
  fieldName: "images",
  maxFiles: 5,
  maxFileSize: 5 * 1024 * 1024,
});

// ==========================
// CREATE BLOG
// ==========================
exports.createBlog = catchAsyncErrors(async (req, res, next) => {
  uploadBlogImages(req, res, async (err) => {
    if (err) {
      return next(
        new ErrorHandler(err.message || "Error uploading images", 400)
      );
    }

    const { title, description } = req.body;

    if (!title || !description) {
      return next(
        new ErrorHandler("Please provide both title and description", 400)
      );
    }

    const blog = await BlogService.createBlog({
      title,
      description,
      userId: req.user._id,
      images: req.files,
    });

    res.status(201).json({ success: true, blog });
  });
});

// ==========================
// GET ALL BLOGS
// ==========================
exports.getAllBlogs = catchAsyncErrors(async (req, res) => {
  const blogsCount = await BlogService.countBlogs();

  const resPerPage = 2;
  const apiSearch = new APISearch(
    BlogService.queryBlogs(),
    req.query
  ).pagination(resPerPage);

  const blogs = await apiSearch.query;

  res.status(200).json({
    success: true,
    blogsCount,
    resPerPage,
    blogs,
  });
});

// ==========================
// GET ALL BLOGS (ADMIN)
// ==========================
exports.getAdminAllBlogs = catchAsyncErrors(async (req, res) => {
  const blogs = await BlogService.getAllBlogs();

  res.status(200).json({
    success: true,
    blogsCount: blogs.length,
    blogs,
  });
});

// ==========================
// GET SINGLE BLOG
// ==========================
exports.getSingleBlog = catchAsyncErrors(async (req, res, next) => {
  const blog = await BlogService.getBlogById(req.params.id);

  if (!blog) return next(new ErrorHandler("No blog found", 404));

  res.status(200).json({ success: true, blog });
});

// ==========================
// UPDATE BLOG
// ==========================
exports.updateBlog = catchAsyncErrors(async (req, res, next) => {
  uploadBlogImages(req, res, async (err) => {
    if (err) {
      return next(
        new ErrorHandler(err.message || "Error uploading images", 400)
      );
    }

    const { title, description } = req.body;

    const updatedBlog = await BlogService.updateBlog(req.params.id, {
      title,
      description,
      newImages: req.files,
    });

    if (!updatedBlog) {
      return next(new ErrorHandler("Blog not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      blog: updatedBlog,
    });
  });
});

// ==========================
// DELETE BLOG
// ==========================
exports.deleteBlog = catchAsyncErrors(async (req, res, next) => {
  const blog = await BlogService.deleteBlog(req.params.id);

  if (!blog) return next(new ErrorHandler("Blog not found", 404));

  res.status(200).json({
    success: true,
    message: "Blog removed",
  });
});
