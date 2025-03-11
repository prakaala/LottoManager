const mysql = require('mysql2/promise');
const db = require('../config/db');

class Request {
    static async create(userId, title, description) {
        try {
            const [result] = await db.query(
                `INSERT INTO requests (user_id, title, description, status) 
                 VALUES (?, ?, ?, 'pending')`,
                [userId, title, description]
            );
            return result.insertId;
        } catch (error) {
            throw error;
        }
    }

    static async getUserRequests(userId) {
        try {
            const [requests] = await db.query(
                `SELECT * FROM requests WHERE user_id = ? ORDER BY created_at DESC`,
                [userId]
            );
            return Array.isArray(requests) ? requests : [];
        } catch (error) {
            console.error('Database error in getUserRequests:', error);
            throw error;
        }
    }

    static async getAllRequests() {
        try {
            const [requests] = await db.query(
                `SELECT r.*, u.username 
                 FROM requests r 
                 JOIN users u ON r.user_id = u.id 
                 ORDER BY r.created_at DESC`
            );
            return Array.isArray(requests) ? requests : [];
        } catch (error) {
            console.error('Database error in getAllRequests:', error);
            throw error;
        }
    }

    static async updateStatus(requestId, status) {
        try {
            const [result] = await db.query(
                'UPDATE requests SET status = ? WHERE id = ?',
                [status, requestId]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    static async deleteRequest(requestId, userId = null) {
        try {
            console.log('Attempting to delete request:', { requestId, userId });
            
            // First check if the request exists and get its details
            const [requests] = await db.query(
                'SELECT * FROM requests WHERE id = ?',
                [requestId]
            );

            if (!requests || requests.length === 0) {
                console.log('Request not found:', requestId);
                return false;
            }

            const request = requests[0];
            console.log('Found request:', request);

            // If userId is provided (non-admin user), verify ownership
            if (userId) {
                if (request.user_id !== userId) {
                    console.log('Unauthorized - user does not own request');
                    return false;
                }

                console.log('User authorized to delete request');
                const [result] = await db.query(
                    'DELETE FROM requests WHERE id = ? AND user_id = ?',
                    [requestId, userId]
                );
                console.log('Delete result:', result);
                return result.affectedRows > 0;
            }
            
            // Admin delete
            const [result] = await db.query(
                'DELETE FROM requests WHERE id = ?',
                [requestId]
            );
            console.log('Admin delete result:', result);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Database error in deleteRequest:', {
                error: error.message,
                stack: error.stack,
                requestId,
                userId
            });
            throw error;
        }
    }
}

module.exports = Request; 