// routes/orders.js

const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders } = require('../controllers/ordercontroller');
const auth = require('../middleware/auth');

// Create order (requires auth)
router.post('/', auth, createOrder);

// Get my orders (requires auth)
router.get('/me', auth, getMyOrders);

module.exports = router;
