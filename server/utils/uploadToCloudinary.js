const cloudinary = require('cloudinary').v2

/**
 * Uploads a file to Cloudinary.
 * @param {Object} file - The file to upload.
 * @param {string} folder - The folder in which to store the file.
 * @param {number} [height] - The height to resize the image to.
 * @param {number} [quality] - The quality of the image.
 * @returns {Promise<Object>} - A Promise that resolves to the uploaded file object.
 */
exports.uploadToCloudinary = async (file, folder, height, quality) => {
  const options = { folder }
  if (height) options.height = height
  if (quality) options.quality = quality
  options.resource_type = 'auto'

  return await cloudinary.uploader.upload(file.tempFilePath, options)
}
