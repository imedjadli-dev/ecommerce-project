const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  //  Detailed error output
  if (process.env.NODE_ENV === "DEVELOPMENT") {
    console.error(err);

    return res.status(err.statusCode).json({
      success: false,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  // Production mode: sanitize output
  if (process.env.NODE_ENV === "PRODUCTION") {
    let error = { ...err };
    error.message = err.message;

    // Mongoose CastError (Invalid ObjectId)
    if (err.name === "CastError") {
      const message = `Resource not found. Invalid field: ${err.path}`;
      error = new ErrorHandler(message, 400);
    }

    // Mongoose Validation Error
    if (err.name === "ValidationError") {
      const message = Object.values(err.errors).map((v) => v.message);
      error = new ErrorHandler(message.join(", "), 400);
    }

    // Mongoose Duplicate Key Error
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue).join(", ");
      const message = `Duplicate value for: ${field}`;
      error = new ErrorHandler(message, 400);
    }

    // Invalid JWT
    if (err.name === "JsonWebTokenError") {
      error = new ErrorHandler("Invalid JWT token. Please login again.", 401);
    }

    // Expired JWT
    if (err.name === "TokenExpiredError") {
      error = new ErrorHandler(
        "JWT token has expired. Please login again.",
        401
      );
    }

    return res.status(error.statusCode).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
