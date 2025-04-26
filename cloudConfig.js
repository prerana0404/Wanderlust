const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const fs = require("fs");

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'wanderlust_DEV',
      allowerdFormats: ["png","jpg","jpeg","WEBP","JFIF"]
    },
  });

  module.exports={
    cloudinary,
    storage,
  }

//   const cloudinary = require("cloudinary").v2;

const cloudinaryUpload = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath);
    fs.unlinkSync(filePath); // Remove file after upload
    return result.secure_url;
  } catch (err) {
    throw new Error("Image upload failed");
  }
};

module.exports = { cloudinaryUpload };
