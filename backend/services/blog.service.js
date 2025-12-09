const Blog = require("../models/blog");
const fs = require("fs");
const path = require("path");

class BlogService {
  // ========== CREATE ==========
  static async createBlog({ title, description, userId, images }) {
    return Blog.create({
      title,
      description,
      user: userId,
      images: images ? images.map((f) => f.filename) : [],
    });
  }

  // ========== COUNT ==========
  static async countBlogs() {
    return Blog.countDocuments();
  }

  // ========== BASIC QUERY ==========
  static queryBlogs() {
    return Blog.find();
  }

  // ========== ALL ==========
  static async getAllBlogs() {
    return Blog.find();
  }

  // ========== GET BY ID ==========
  static async getBlogById(id) {
    return Blog.findById(id).populate("user", "name");
  }

  // ========== UPDATE ==========
  static async updateBlog(id, { title, description, newImages }) {
    const blog = await Blog.findById(id);
    if (!blog) return null;

    // Remove old images if new uploaded
    if (newImages && newImages.length > 0) {
      this.removeImages(blog.images);
    }

    const updatedImages =
      newImages && newImages.length > 0
        ? newImages.map((f) => f.filename)
        : blog.images;

    blog.title = title !== undefined ? title : blog.title;
    blog.description =
      description !== undefined ? description : blog.description;
    blog.images = updatedImages;

    await blog.save();

    return blog;
  }

  // ========== DELETE ==========
  static async deleteBlog(id) {
    const blog = await Blog.findById(id);
    if (!blog) return null;

    this.removeImages(blog.images);

    await blog.deleteOne();

    return blog;
  }

  // ========== DELETE IMAGES ==========
  static removeImages(images) {
    if (!Array.isArray(images) || images.length === 0) return;

    images.forEach((image) => {
      if (!image) return;

      if (image === "default-avatar.jpg") return;

      const filePath = path.join(
        process.cwd(),
        "backend",
        "public",
        "blogs",
        image
      );
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(
            "Failed to delete image:",
            filePath,
            err.message || err
          );
        }
      });
    });
  }
}

module.exports = BlogService;
