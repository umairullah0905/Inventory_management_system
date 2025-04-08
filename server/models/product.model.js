const mongoose = require("mongoose");


const productSchema = new mongoose.Schema({
  name: String,
  category: String,
  sku: String,
  price: Number,
  tags: [String]
});


module.exports = mongoose.model("Product", productSchema);

