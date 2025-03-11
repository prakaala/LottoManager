const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

console.log('Loading orderRoutes...', orderController);

// Test route (no auth required)
router.get('/test', orderController.testOrder);

// Protected routes
router.post('/create', protect, orderController.createOrder);
router.get('/user-orders', protect, orderController.getUserOrders);
router.get('/stats', protect, adminOnly, orderController.getSalesStats);
router.delete('/:orderId', protect, adminOnly, orderController.deleteOrder);
router.get('/all', protect, adminOnly, orderController.getAllOrders);

module.exports = router;