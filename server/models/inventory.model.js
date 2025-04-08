const mongoose = require("mongoose");


const inventorySchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  type: { type: String, enum: ['IN', 'OUT', 'ADJUST'] },
  quantity: Number,
  reason: String,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Inventory", inventorySchema);

