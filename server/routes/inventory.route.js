const express = require('express');
const {
  recordInventory,
  getInventoryRecords,
  getInventorySummary,
  removeFromInventory
} = require('../controllers/inventory.controller.js');
const { protect } = require('../middleware/auth.middleware.js');

const router = express.Router();

// Get all inventory records or add a new one (IN)
router.route('/')
  .get(protect, getInventoryRecords)
  .post(protect, recordInventory);

// Get inventory summary (total quantity and value)
router.route('/summary')
  .get(protect, getInventorySummary);

// Remove items from inventory (OUT)
router.route('/remove')
  .post(protect, removeFromInventory);

module.exports = router;
