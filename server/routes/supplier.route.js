const express = require('express');
const {
  addSupplier,
  getSuppliers,
  updateSupplier,
  deleteSupplier
} = require('../controllers/supplier.controller.js');
const { protect } = require('../middleware/auth.middleware.js');
const { authorizeRoles } = require('../middleware/role.middleware.js');


const router = express.Router();

router.route('/')
  .get(protect, getSuppliers)
  .post(protect, authorizeRoles('admin'), addSupplier);

router.route('/:id')
  .put(protect, authorizeRoles('admin'), updateSupplier)
  .delete(protect, authorizeRoles('admin'), deleteSupplier);


module.exports = router;

