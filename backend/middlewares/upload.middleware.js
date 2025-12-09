const multer = require("multer");
const fs = require("fs");
const path = require("path");

/**
 * Factory that creates a reusable multer upload middleware.
 *
 * @param {Object} options
 * @param {string} options.folder - Destination folder relative to project root (required)
 * @param {string} [options.fieldName='images'] - Form field name
 * @param {number} [options.maxFiles=5] - Max number of files
 * @param {number} [options.maxFileSize=5 * 1024 * 1024] - Max file size in bytes (default 5MB)
 * @returns {Function} - middleware function (req, res, next) that handles file upload
 *
 * Usage:
 *   const uploadFile = createUpload({ folder: 'backend/public/foldername' });
 *   uploadFile(req, res, (err) => { ... }); // or use as route middleware
 */
function createUpload({
  folder,
  fieldName = "images",
  maxFiles = 5,
  maxFileSize = 5 * 1024 * 1024,
}) {
  if (!folder) {
    throw new Error("createUpload: 'folder' option is required");
  }

  const destDir = path.isAbsolute(folder)
    ? folder
    : path.join(process.cwd(), folder);

  // Ensure directory exists
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, destDir);
    },
    filename: function (req, file, cb) {
      const ext = file.originalname.split(".").pop();
      const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, `${file.fieldname}-${unique}.${ext}`);
    },
  });

  const upload = multer({
    storage,
    limits: { fileSize: maxFileSize },
    fileFilter: (req, file, cb) => {
      // Allow common image mime types
      if (file.mimetype && file.mimetype.startsWith("image/")) {
        cb(null, true);
      } else {
        cb(new Error("Only image files are allowed"));
      }
    },
  });

  return function uploadMiddleware(req, res, next) {
    const uploader = upload.array(fieldName, maxFiles);
    uploader(req, res, (err) => {
      if (err) {
        return next(err);
      }
      return next();
    });
  };
}

module.exports = { createUpload };
