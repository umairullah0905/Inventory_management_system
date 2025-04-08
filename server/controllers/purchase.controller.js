const Purchase = require("../models/purchase.model.js");

 const createPurchase = async (req, res) => {
  const purchase = await Purchase.create(req.body);
  res.status(201).json(purchase);
};

 const getPurchases = async (req, res) => {
  const purchases = await Purchase.find().populate('supplierId');
  res.json(purchases);
};

module.exports = {
    createPurchase,
    getPurchases,
};