const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middlewares/authMiddleware');
const {
    createRequest,
    getUserRequests,
    getAllRequests,
    updateRequestStatus,
    deleteRequest
} = require('../controllers/requestController');

// User routes
router.post('/create', protect, createRequest);
router.get('/user', protect, getUserRequests);

// Admin routes
router.get('/all', protect, adminOnly, getAllRequests);
router.put('/:requestId/status', protect, adminOnly, updateRequestStatus);

// Add this with other routes
router.delete('/:requestId', protect, deleteRequest);

module.exports = router; 