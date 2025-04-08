const express = require('express');
const {
  createPurchase,
  getPurchases
} = require('../controllers/purchase.controller.js');
const { protect } = require('../middleware/auth.middleware.js');

const router = express.Router();

router.route('/')
  .get(protect, getPurchases)
  .post(protect, createPurchase);

  module.exports = router;

