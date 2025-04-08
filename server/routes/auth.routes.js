const express = require('express');
const { register, login, getProfile } = require('../controllers/auth.controller.js');
const { protect } = require('../middleware/auth.middleware.js')
const router = express.Router();

// Public Routes
router.post('/register', register);
router.post('/login', login);

// Protected Route
router.get('/profile', protect, getProfile);

module.exports = router;
