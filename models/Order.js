const db = require('../config/db');

class Order {
    static async create(userId, items, totalAmount) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            console.log('Creating order with:', {
                userId,
                items: JSON.stringify(items),
                totalAmount
            });

            // Create order with completed status instead of pending
            const [orderResult] = await connection.query(
                'INSERT INTO orders (user_id, total_amount, status) VALUES (?, ?, "completed")',
                [userId, totalAmount]
            );
            const orderId = orderResult.insertId;

            // Insert order items
            for (const item of items) {
                console.log('Processing item:', item);
                
                const price = typeof item.price === 'string' 
                    ? parseFloat(item.price.replace('$', ''))
                    : parseFloat(item.price);

                if (isNaN(price)) {
                    throw new Error(`Invalid price for item: ${item.name}`);
                }

                await connection.query(
                    `INSERT INTO order_items 
                     (order_id, ticket_id, ticket_name, price, quantity) 
                     VALUES (?, ?, ?, ?, ?)`,
                    [
                        orderId,
                        item.id,
                        item.name,
                        price,
                        parseInt(item.quantity)
                    ]
                );
            }

            await connection.commit();
            return orderId;
        } catch (error) {
            console.error('Order creation error:', error);
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async getUserOrders(userId) {
        const [orders] = await db.query(
            `SELECT o.*, 
                    GROUP_CONCAT(
                        CONCAT(oi.ticket_name, ' (', oi.quantity, ')')
                    ) as items
             FROM orders o
             LEFT JOIN order_items oi ON o.id = oi.order_id
             WHERE o.user_id = ?
             GROUP BY o.id
             ORDER BY o.created_at DESC`,
            [userId]
        );
        return orders;
    }

    static async getAllOrders() {
        const [orders] = await db.query(
            `SELECT o.*, u.username,
                    GROUP_CONCAT(
                        CONCAT(oi.ticket_name, ' (', oi.quantity, ')')
                    SEPARATOR ', '
                    ) as items
             FROM orders o
             JOIN users u ON o.user_id = u.id
             LEFT JOIN order_items oi ON o.id = oi.order_id
             GROUP BY o.id, o.user_id, o.total_amount, o.status, o.created_at, u.username
             ORDER BY o.created_at DESC`
        );
        return orders;
    }

    static async getSalesStats() {
        const [stats] = await db.query(
            `SELECT 
                SUM(total_amount) as totalSales,
                COUNT(*) as totalOrders,
                AVG(total_amount) as averageOrderValue,
                DATE_FORMAT(created_at, '%Y-%m') as month
             FROM orders
             WHERE status = 'completed'
             GROUP BY month
             ORDER BY month DESC
             LIMIT 12`
        );
        return stats;
    }

    static async deleteOrder(orderId) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // Delete order items first (due to foreign key constraint)
            await connection.query(
                'DELETE FROM order_items WHERE order_id = ?',
                [orderId]
            );

            // Delete the order
            const [result] = await connection.query(
                'DELETE FROM orders WHERE id = ?',
                [orderId]
            );

            await connection.commit();
            return result.affectedRows > 0;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
}

module.exports = Order; 