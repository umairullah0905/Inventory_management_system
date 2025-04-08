// controllers/product.controller.js
const Product = require("../models/product.model.js");

 const createProduct = async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
};

 const updateProduct = async (req, res) => {
  const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};

 const deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Product deleted' });
};

 const getAllProducts = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};

module.exports = {
    createProduct,
    updateProduct,
    deleteProduct,
    getAllProducts
};