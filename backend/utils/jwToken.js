/**
 * Sends JWT token in a secure cookie + JSON response.
 *
 * @param {Object} user - Mongoose user instance
 * @param {number} statusCode - HTTP status code
 * @param {Object} res - Express response object
 */
const sendToken = (user, statusCode, res) => {
  const token = user.getJwToken();

  // Calculate cookie expiration in days
  const expiresInDays = Number(process.env.COOKIE_EXPIRES_TIME || 7); // default: 7 days

  const cookieOptions = {
    expires: new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000),
    httpOnly: true, // Prevent JS access to cookie
    secure: process.env.NODE_ENV === "production", // only HTTPS in production
    sameSite: "strict",
  };

  const { _id, email, role } = user;

  res.status(statusCode).cookie("token", token, cookieOptions).json({
    success: true,
    token,
    user: {
      _id,
      email,
      role,
    },
  });
};

module.exports = sendToken;
