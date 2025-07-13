const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const Product = require("../models/productModel"); 

router.get("/", productController.getProducts);
router.get("/search", productController.searchProducts); 
router.post("/", productController.addProduct);

module.exports = router;
