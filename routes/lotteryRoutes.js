const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
    addTicket,
    searchTickets,
    getUserTickets,
    deleteTicket
} = require('../controllers/lotteryController');

// Routes
router.post('/add', protect, addTicket);
router.get('/search', protect, searchTickets);
router.get('/user', protect, getUserTickets);
router.delete('/:ticketId', protect, deleteTicket);

module.exports = router; 