const express = require('express');
const {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts
} = require('../controllers/product.controller.js');
const { protect } = require('../middleware/auth.middleware.js');
const { authorizeRoles } = require('../middleware/role.middleware.js');

const router = express.Router();

router.route('/')
  .get(protect, getAllProducts)
  .post(protect, authorizeRoles('admin'), createProduct);

router.route('/:id')
  .put(protect, authorizeRoles('admin'), updateProduct)
  .delete(protect, authorizeRoles('admin'), deleteProduct);

  module.exports = router;
