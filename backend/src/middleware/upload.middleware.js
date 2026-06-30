const multer = require('multer')
const path = require('path')

// Stores uploads in memory; the controller is responsible for pushing the
// buffer to Cloudinary (or any object storage) and saving the resulting URL.
// Local disk storage is intentionally avoided since most hosts (Render,
// Railway, Vercel) have ephemeral filesystems — files would vanish on redeploy.
const storage = multer.memoryStorage()

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

function fileFilter(req, file, cb) {
  if (!ALLOWED_TYPES.includes(file.mimetype)) {
    return cb(new Error('Only JPEG, PNG, or WEBP images are allowed'))
  }
  cb(null, true)
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
})

module.exports = { upload }
