const express = require("express");
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const sellerController = require("../controllers/sellerController");
const sellerRouter = express.Router();

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'products',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }],
  },
});

sellerRouter.post("/products", multer({storage: storage}).single('image'), sellerController.createProduct);
sellerRouter.get("/products", sellerController.getProducts);
sellerRouter.delete("/products/:id", sellerController.deleteProduct);

module.exports = sellerRouter;
