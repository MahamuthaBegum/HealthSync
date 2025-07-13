const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  ProductName: String,
  Discount: String,
  CurrentPrice: String,
  MRP: String,
  MarketedBy: String,
  Availability: String,
  ImageName: String,
  Category: String,
});

const Product = mongoose.model("ProductDetails", productSchema, "ProductDetails");

module.exports = Product;


