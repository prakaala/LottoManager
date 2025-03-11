import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './AdminRequests.css';

const AdminRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAllRequests();
    }, []);

    const fetchAllRequests = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                'http://localhost:5000/api/requests/all',
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            
            if (response.data.success && Array.isArray(response.data.requests)) {
                setRequests(response.data.requests);
            } else {
                setRequests([]);
                console.error('Invalid response format:', response.data);
            }
        } catch (error) {
            console.error('Error fetching requests:', error);
            setError('Failed to load requests');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (requestId, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `http://localhost:5000/api/requests/${requestId}/status`,
                { status: newStatus },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            // Refresh requests after update
            fetchAllRequests();
        } catch (error) {
            console.error('Error updating request:', error);
        }
    };

    const handleDelete = async (requestId) => {
        if (!window.confirm('Are you sure you want to delete this request?')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.delete(
                `http://localhost:5000/api/requests/${requestId}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            fetchAllRequests();
        } catch (error) {
            console.error('Error deleting request:', error);
            setError('Failed to delete request');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="admin-requests-container">
            <h2>Manage Requests</h2>
            <div className="requests-grid">
                {requests.map(request => (
                    <div key={request.id} className={`request-card ${request.status}`}>
                        <div className="request-header">
                            <h3>{request.title}</h3>
                            <div className="header-actions">
                                <span className="user-info">
                                    By: {request.username}
                                </span>
                                <button 
                                    className="delete-btn"
                                    onClick={() => handleDelete(request.id)}
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                        <p>{request.description}</p>
                        <div className="request-actions">
                            {request.status === 'pending' && (
                                <>
                                    <button
                                        className="approve-btn"
                                        onClick={() => handleStatusUpdate(request.id, 'approved')}
                                    >
                                        Approve
                                    </button>
                                    <button
                                        className="reject-btn"
                                        onClick={() => handleStatusUpdate(request.id, 'rejected')}
                                    >
                                        Reject
                                    </button>
                                </>
                            )}
                            <span className="status">Status: {request.status}</span>
                        </div>
                        <div className="request-footer">
                            <span className="date">
                                {new Date(request.created_at).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminRequests; 