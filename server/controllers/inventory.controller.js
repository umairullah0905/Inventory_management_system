const Inventory = require("../models/inventory.model.js");
const Product = require("../models/product.model.js");

// Record a new inventory operation (IN or OUT)
const recordInventory = async (req, res) => {
  try {
    const record = await Inventory.create(req.body);

    // Update the actual product quantity
    const product = await Product.findById(record.productId);
    if (record.type === 'IN') {
      product.quantity += record.quantity;
    } else if (record.type === 'OUT') {
      if (product.quantity < record.quantity) {
        return res.status(400).json({ message: "Insufficient stock for removal." });
      }
      product.quantity -= record.quantity;
    }
    await product.save();

    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ message: "Error recording inventory", error });
  }
};

// Get all inventory records
const getInventoryRecords = async (req, res) => {
  try {
    const records = await Inventory.find().populate('productId');
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: "Error fetching records", error });
  }
};

// Get total inventory count and value
// const getInventorySummary = async (req, res) => {
//   try {
//     const products = await Product.find();
//     let totalQuantity = 0;
//     let totalValue = 0;

//     products.forEach(product => {
//       totalQuantity += product.quantity;
//       totalValue += product.quantity * product.price;
//     });

//     res.json({
//       totalQuantity,
//       totalValue
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching summary", error });
//   }
// };

const getInventorySummary = async (req, res) => {
  try {
    const inventoryRecords = await Inventory.find().populate("productId");

    let totalQuantity = 0;
    let totalValue = 0;

    inventoryRecords.forEach(record => {
      const quantity = record.quantity;
      const price = record.productId?.price || 0;

      // For "IN" type, add to quantity
      if (record.type === "IN") {
        totalQuantity += quantity;
        totalValue += quantity * price;
      }

      // For "OUT" type, subtract from quantity and value
      if (record.type === "OUT") {
        totalQuantity -= quantity;
        totalValue -= quantity * price;
      }
    });

    res.json({
      totalQuantity,
      totalValue
    });
  } catch (error) {
    console.error("Error fetching inventory summary:", error);
    res.status(500).json({ message: "Error fetching summary", error });
  }
};

// Remove items from inventory (creates an OUT record)
const removeFromInventory = async (req, res) => {
  try {
    const { productId, quantity, reason } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found." });

    if (product.quantity < quantity) {
      return res.status(400).json({ message: "Not enough quantity in stock to remove." });
    }

    const record = await Inventory.create({
      productId,
      quantity,
      type: 'OUT',
      reason
    });

    product.quantity -= quantity;
    await product.save();

    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ message: "Error removing from inventory", error });
  }
};

module.exports = {
  recordInventory,
  getInventoryRecords,
  getInventorySummary,
  removeFromInventory
};
