class APISearch {
  /**
   * @param {Object} query - Mongoose query object (e.g., Model.find()).
   * @param {Object} querySearch - Request query parameters.
   */
  constructor(query, querySearch) {
    this.query = query;
    this.querySearch = querySearch;
  }

  /**
   * Search by keyword in "name" field.
   * Example: /?keyword=phone
   */
  search() {
    const { keyword } = this.querySearch;

    if (keyword) {
      const searchCondition = {
        name: {
          $regex: keyword,
          $options: "i", // case-insensitive
        },
      };

      this.query = this.query.find(searchCondition);
    }

    return this;
  }

  /**
   * Filter using Mongo operators.
   * Example: /?price[gte]=10&price[lte]=100
   */
  filter() {
    // Copy query parameters
    const queryObj = { ...this.querySearch };

    // Remove fields that are not filters
    const excludedFields = ["keyword", "limit", "page"];
    excludedFields.forEach((field) => delete queryObj[field]);

    // Convert operators: gte → $gte, lt → $lt, etc.
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  /**
   * Pagination
   * @param {number} limit - number of items per page
   */
  pagination(limit) {
    const page = Number(this.querySearch.page) || 1;
    const skip = limit * (page - 1);

    this.query = this.query.limit(limit).skip(skip);
    return this;
  }
}

module.exports = APISearch;
