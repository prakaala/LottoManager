const Lottery = require('../models/Lottery');

const addTicket = async (req, res) => {
    try {
        const { barcode, scannedAt } = req.body;
        const userId = req.user.id;

        console.log('Attempting to add ticket:', {
            barcode,
            scannedAt,
            userId,
            user: req.user
        });

        // Validate input
        if (!barcode || !scannedAt) {
            console.log('Missing required fields');
            return res.status(400).json({
                success: false,
                message: 'Barcode and scan time are required'
            });
        }

        // Validate date format
        if (!Date.parse(scannedAt)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid date format'
            });
        }

        // Check if barcode already exists
        const existing = await Lottery.findByBarcode(barcode);
        if (existing) {
            console.log('Duplicate barcode found:', existing);
            return res.status(400).json({
                success: false,
                message: 'This ticket has already been scanned'
            });
        }

        const ticketId = await Lottery.create(userId, barcode, scannedAt);
        console.log('Ticket created successfully:', ticketId);
        
        res.status(201).json({
            success: true,
            message: 'Lottery ticket saved successfully',
            ticketId
        });
    } catch (error) {
        console.error('Add ticket error details:', {
            error: error.message,
            stack: error.stack,
            body: req.body,
            user: req.user
        });
        res.status(500).json({
            success: false,
            message: 'Failed to save ticket: ' + error.message
        });
    }
};

const searchTickets = async (req, res) => {
    try {
        const { query } = req.query;
        const tickets = await Lottery.searchTickets(query);
        
        res.json({
            success: true,
            tickets
        });
    } catch (error) {
        console.error('Search tickets error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to search tickets',
            error: error.message
        });
    }
};

const getUserTickets = async (req, res) => {
    try {
        const userId = req.user.id;
        const tickets = await Lottery.getUserTickets(userId);
        
        res.json({
            success: true,
            tickets
        });
    } catch (error) {
        console.error('Get user tickets error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch tickets',
            error: error.message
        });
    }
};

const deleteTicket = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const userId = req.user.role === 'admin' ? null : req.user.id;

        const deleted = await Lottery.deleteTicket(ticketId, userId);
        
        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Ticket not found or unauthorized to delete'
            });
        }

        res.json({
            success: true,
            message: 'Ticket deleted successfully'
        });
    } catch (error) {
        console.error('Delete ticket error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete ticket',
            error: error.message
        });
    }
};

module.exports = {
    addTicket,
    searchTickets,
    getUserTickets,
    deleteTicket
}; 