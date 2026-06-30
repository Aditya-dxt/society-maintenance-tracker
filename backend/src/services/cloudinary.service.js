// Lightweight wrapper so the rest of the app only ever calls uploadImageBuffer().
// Requires CLOUDINARY_URL or the three CLOUDINARY_* env vars to be set.
const cloudinary = require('cloudinary').v2

let configured = false
function ensureConfigured() {
  if (configured) return
  if (process.env.CLOUDINARY_CLOUD_NAME) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    })
  }
  configured = true
}

/**
 * Uploads an in-memory buffer (from multer memoryStorage) to Cloudinary.
 * @param {Buffer} buffer
 * @param {string} folder
 * @returns {Promise<string>} the secure URL of the uploaded image
 */
function uploadImageBuffer(buffer, folder = 'aangan/complaints') {
  ensureConfigured()
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => {
        if (error) return reject(error)
        resolve(result.secure_url)
      }
    )
    stream.end(buffer)
  })
}

module.exports = { uploadImageBuffer }
