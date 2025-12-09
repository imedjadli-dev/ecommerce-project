const Category = require("../models/category");
const Product = require("../models/product");

class CategoryService {
  // FIND BY NAME
  static async findByName(name) {
    return Category.findOne({ name });
  }

  // CREATE CATEGORY
  static async createCategory(data) {
    return Category.create(data);
  }

  // GET ALL
  static async getAllCategories() {
    return Category.find();
  }

  // GET BY ID
  static async getCategoryById(id) {
    return Category.findById(id).populate("products", "name images");
  }

  // UPDATE
  static async updateCategory(id, data) {
    return Category.findByIdAndUpdate(
      id,
      { name: data.name },
      {
        new: true,
        runValidators: true,
        categoryFindAndModify: false,
      }
    );
  }

  // DELETE CATEGORY & RELATED PRODUCTS
  static async deleteCategory(id) {
    const category = await Category.findById(id);
    if (!category) return null;

    const productIds = category.products;

    await Category.findByIdAndDelete(id);
    await Product.deleteMany({ _id: { $in: productIds } });

    return category;
  }
}

module.exports = CategoryService;
