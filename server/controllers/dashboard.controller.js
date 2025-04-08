const Product = require('../models/product.model.js');
const Supplier = require('../models/supplier.model.js');
const Purchase = require('../models/purchase.model.js');
const Inventory = require('../models/inventory.model.js');

const getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalSuppliers = await Supplier.countDocuments();
    const totalPurchases = await Purchase.countDocuments();

    // Aggregate low stock from Inventory
    const lowStockAggregation = await Inventory.aggregate([
      {
        $group: {
          _id: '$productId',
          totalQuantity: {
            $sum: {
              $cond: [{ $eq: ['$type', 'IN'] }, '$quantity', { $multiply: ['$quantity', -1] }]
            }
          }
        }
      },
      { $match: { totalQuantity: { $lt: 10 } } }
    ]);

    // Extract product IDs
    const lowStockProductIds = lowStockAggregation.map(item => item._id);

    // Fetch product details and attach quantity from aggregation
    const products = await Product.find({ _id: { $in: lowStockProductIds } });

    const lowStockProducts = products.map(product => {
      const aggItem = lowStockAggregation.find(item => item._id.toString() === product._id.toString());
      return {
        _id: product._id,
        name: product.name,
        category: product.category,
        sku: product.sku,
        price: product.price,
        tags: product.tags,
        quantity: aggItem?.totalQuantity ?? 0 // Use quantity from aggregation
      };
    });

    // Get recent inventory activity
    const recentInventory = await Inventory.find()
      .sort({ date: -1 })
      .limit(5)
      .populate('productId');

    res.json({
      totalProducts,
      totalSuppliers,
      totalPurchases,
      lowStock: lowStockProducts,
      recentInventory
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Dashboard fetch failed' });
  }
};

module.exports = {
  getDashboardStats,
};
