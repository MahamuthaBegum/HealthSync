const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const Product = require("../models/productModel"); // ✅ FIXED

router.get("/", productController.getProducts);
router.get("/search", productController.searchProducts); // ✅ New search route
router.post("/", productController.addProduct);

module.exports = router;
