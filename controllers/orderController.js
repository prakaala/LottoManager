const db = require('../config/db');
const Order = require('../models/Order');

console.log('Loading orderController...');

const createOrder = async (req, res) => {
    try {
        const { items, totalAmount } = req.body;
        const userId = req.user.id;

        console.log('Received order request:', {
            userId,
            items,
            totalAmount,
            body: req.body
        });

        // Validate input
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No items in order',
                received: req.body
            });
        }

        // Validate each item
        for (const item of items) {
            if (!item.id || !item.name || !item.price || !item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid item data',
                    invalidItem: item
                });
            }
        }

        const orderId = await Order.create(userId, items, totalAmount);

        res.status(201).json({
            success: true,
            orderId,
            message: 'Order created successfully'
        });
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create order: ' + error.message,
            error: error.stack
        });
    }
};

const getUserOrders = async (req, res) => {
    try {
        const userId = req.user.id;

        const [orders] = await db.query(
            `SELECT o.*, 
                    GROUP_CONCAT(CONCAT(oi.ticket_name, ':', oi.quantity)) as items
             FROM orders o
             LEFT JOIN order_items oi ON o.id = oi.order_id
             WHERE o.user_id = ?
             GROUP BY o.id
             ORDER BY o.created_at DESC`,
            [userId]
        );

        res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

const testOrder = async (req, res) => {
    try {
        const [result] = await db.query('SELECT * FROM orders LIMIT 1');
        res.json({ success: true, message: 'Order system is connected', test: result });
    } catch (error) {
        console.error('Test order error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

const getSalesStats = async (req, res) => {
    try {
        const stats = await Order.getSalesStats();
        res.json({
            success: true,
            stats
        });
    } catch (error) {
        console.error('Get sales stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch sales statistics'
        });
    }
};

const deleteOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        
        // Only admin can delete orders
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Only administrators can delete orders'
            });
        }

        const deleted = await Order.deleteOrder(orderId);
        
        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.json({
            success: true,
            message: 'Order deleted successfully'
        });
    } catch (error) {
        console.error('Delete order error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete order'
        });
    }
};

const getAllOrders = async (req, res) => {
    try {
        // Only admin can access all orders
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admin only.'
            });
        }

        const orders = await Order.getAllOrders();
        
        res.json({
            success: true,
            orders
        });
    } catch (error) {
        console.error('Get all orders error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch orders'
        });
    }
};

console.log('Exporting order functions:', { createOrder, getUserOrders, testOrder, getSalesStats, deleteOrder, getAllOrders });

module.exports = {
    createOrder,
    getUserOrders,
    testOrder,
    getSalesStats,
    deleteOrder,
    getAllOrders
}; 