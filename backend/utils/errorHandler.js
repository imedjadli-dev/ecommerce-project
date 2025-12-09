/**
 * Custom application error class.
 * Used to throw consistent API errors with a message and a status code.
 */
class ErrorHandler extends Error {
  /**
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code (default: 500)
   */
  constructor(message = "Something went wrong", statusCode = 500) {
    super(message);

    this.statusCode = statusCode;

    // Ensures proper stack trace for debugging
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ErrorHandler;
