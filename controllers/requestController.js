const Request = require('../models/Request');
const db = require('../config/db');

const createRequest = async (req, res) => {
    try {
        const { title, description } = req.body;
        const userId = req.user.id;

        const requestId = await Request.create(userId, title, description);
        
        res.status(201).json({
            success: true,
            message: 'Request created successfully',
            requestId
        });
    } catch (error) {
        console.error('Create request error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create request',
            error: error.message
        });
    }
};

const getUserRequests = async (req, res) => {
    try {
        const userId = req.user.id;
        const requests = await Request.getUserRequests(userId);
        
        res.json({
            success: true,
            requests: Array.isArray(requests) ? requests : []
        });
    } catch (error) {
        console.error('Get user requests error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch requests',
            error: error.message,
            requests: []
        });
    }
};

const getAllRequests = async (req, res) => {
    try {
        const requests = await Request.getAllRequests();
        
        res.json({
            success: true,
            requests: Array.isArray(requests) ? requests : []
        });
    } catch (error) {
        console.error('Get all requests error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch requests',
            error: error.message,
            requests: []
        });
    }
};

const updateRequestStatus = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { status } = req.body;
        
        if (!['pending', 'approved', 'rejected'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }

        const updated = await Request.updateStatus(requestId, status);
        
        if (!updated) {
            return res.status(404).json({
                success: false,
                message: 'Request not found'
            });
        }

        res.json({
            success: true,
            message: 'Request status updated successfully'
        });
    } catch (error) {
        console.error('Update request status error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update request status',
            error: error.message
        });
    }
};

const deleteRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const userId = req.user.role === 'admin' ? null : req.user.id;

        console.log('Delete request attempt:', {
            requestId,
            userId,
            userRole: req.user.role,
            user: req.user
        });

        // Verify the request exists first
        const [requests] = await db.query(
            'SELECT * FROM requests WHERE id = ?',
            [requestId]
        );

        if (!requests || requests.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Request not found'
            });
        }

        const deleted = await Request.deleteRequest(requestId, userId);
        
        if (!deleted) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized to delete this request'
            });
        }

        res.json({
            success: true,
            message: 'Request deleted successfully'
        });
    } catch (error) {
        console.error('Delete request error:', {
            error: error.message,
            stack: error.stack,
            requestId: req.params.requestId,
            userId: req.user?.id,
            userRole: req.user?.role
        });
        res.status(500).json({
            success: false,
            message: 'Server error while deleting request',
            error: error.message
        });
    }
};

module.exports = {
    createRequest,
    getUserRequests,
    getAllRequests,
    updateRequestStatus,
    deleteRequest
}; 