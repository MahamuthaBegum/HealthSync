const Product = require("../models/productModel");

exports.getProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const category = req.query.category;

    const filter = category
      ? { Category: { $regex: `^${category.trim()}$`, $options: "i" } }
      : {};

    const products = await Product.find(filter).limit(limit);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.searchProducts = async (req, res) => {
  try {
    const query = req.query.query || "";

    const results = await Product.find({
      ProductName: { $regex: query, $options: "i" },
    });

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
