/* eslint-disable comma-dangle */
/* eslint-disable no-unused-vars */
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
  // eslint-disable-next-line object-shorthand
  cloudinary: cloudinary,
  params: {
    folder: 'YelpCamp',
    format: async (req, file) => 'png', // supports promises as well
  },
});

module.exports = storage;
