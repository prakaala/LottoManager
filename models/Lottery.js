const db = require('../config/db');

class Lottery {
    static async create(userId, barcode, scannedAt) {
        try {
            console.log('Creating lottery ticket:', { userId, barcode, scannedAt });

            // Validate inputs
            if (!userId || !barcode || !scannedAt) {
                throw new Error('Missing required fields');
            }

            // Format the date to MySQL datetime format
            const formattedDate = new Date(scannedAt).toISOString().slice(0, 19).replace('T', ' ');

            const [result] = await db.query(
                `INSERT INTO lottery_tickets (user_id, barcode, scanned_at) 
                 VALUES (?, ?, ?)`,
                [userId, barcode, formattedDate]
            );

            console.log('Insert result:', result);
            return result.insertId;
        } catch (error) {
            console.error('Database error in create:', {
                error: error.message,
                code: error.code,
                sqlMessage: error.sqlMessage
            });
            throw error;
        }
    }

    static async findByBarcode(barcode) {
        try {
            console.log('Searching for barcode:', barcode);
            const [tickets] = await db.query(
                `SELECT lt.*, u.username 
                 FROM lottery_tickets lt
                 JOIN users u ON lt.user_id = u.id
                 WHERE lt.barcode = ?`,
                [barcode]
            );
            console.log('Search result:', tickets[0] || 'Not found');
            return tickets[0];
        } catch (error) {
            console.error('Database error in findByBarcode:', error);
            throw error;
        }
    }

    static async getUserTickets(userId) {
        try {
            const [tickets] = await db.query(
                `SELECT * FROM lottery_tickets 
                 WHERE user_id = ?
                 ORDER BY scanned_at DESC`,
                [userId]
            );
            return tickets;
        } catch (error) {
            throw error;
        }
    }

    static async searchTickets(searchTerm) {
        try {
            const [tickets] = await db.query(
                `SELECT lt.*, u.username 
                 FROM lottery_tickets lt
                 JOIN users u ON lt.user_id = u.id
                 WHERE lt.barcode LIKE ?
                 ORDER BY lt.scanned_at DESC`,
                [`%${searchTerm}%`]
            );
            return tickets;
        } catch (error) {
            throw error;
        }
    }

    static async deleteTicket(ticketId, userId = null) {
        try {
            // If userId is provided, ensure user owns the ticket
            if (userId) {
                const [result] = await db.query(
                    'DELETE FROM lottery_tickets WHERE id = ? AND user_id = ?',
                    [ticketId, userId]
                );
                return result.affectedRows > 0;
            }
            
            // Admin delete (no user_id check)
            const [result] = await db.query(
                'DELETE FROM lottery_tickets WHERE id = ?',
                [ticketId]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Database error in deleteTicket:', error);
            throw error;
        }
    }
}

module.exports = Lottery; 