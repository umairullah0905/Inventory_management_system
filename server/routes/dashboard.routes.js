const express = require('express');
const { getDashboardStats } = require('../controllers/dashboard.controller.js');
const { protect } = require('../middleware/auth.middleware.js');


const router = express.Router();

router.get('/', protect, getDashboardStats);

module.exports = router;
