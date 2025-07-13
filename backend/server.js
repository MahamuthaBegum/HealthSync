const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const cors = require("cors");
const Product = require("./models/productModel");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

connectDB().then(async () => {
  const count = await Product.countDocuments({}); 
  console.log(`📦 Total products in DB: ${count}`);

  // API route
  app.use("/api/products", productRoutes); //

  // Home test route
  app.get("/", (req, res) => { //
    res.send("API is running...");
  });

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); //

}).catch(err => {
  console.error("Failed to connect to MongoDB and start server:", err);
  process.exit(1); // Exit if connection fails
});
