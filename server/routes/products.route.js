const express = require('express')
const path = require("path");
// const multer = require("multer");
const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/products.controller");

const router = express.Router();

// Configure Multer for file uploads
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads"); // make sure this folder exists
//   },
//   filename: function (req, file, cb) {
//     const ext = path.extname(file.originalname);
//     cb(null, `${Date.now()}${ext}`);
//   },
// });
// const upload = multer({ storage });

// CRUD routes
router.get("/list", getProducts);
router.get("/list/:id", getProduct);
router.post("/create", /*upload.single("image"), */ createProduct);
router.put("update/:id", /*upload.single("image"), */ updateProduct);
router.delete("delete/:id", deleteProduct);

module.exports = router;
