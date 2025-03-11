import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './UserRequests.css';

const UserRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                'http://localhost:5000/api/requests/user',
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            
            // Check if response.data.requests exists and is an array
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

    const handleDelete = async (requestId) => {
        if (!window.confirm('Are you sure you want to delete this request?')) {
            return;
        }

        try {
            setError(null); // Clear any existing errors
            const token = localStorage.getItem('token');
            
            if (!token) {
                setError('Not authenticated. Please log in again.');
                return;
            }

            console.log('Attempting to delete request:', requestId);
            
            const response = await axios.delete(
                `http://localhost:5000/api/requests/${requestId}`,
                {
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('Delete response:', response.data);

            if (response.data.success) {
                // Remove the deleted request from state
                setRequests(prev => prev.filter(req => req.id !== requestId));
            } else {
                setError(response.data.message || 'Failed to delete request');
            }
        } catch (error) {
            console.error('Delete error:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            
            if (error.response?.status === 403) {
                setError('You are not authorized to delete this request');
            } else if (error.response?.status === 404) {
                setError('Request not found');
            } else {
                setError(error.response?.data?.message || 'Failed to delete request');
            }
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="user-requests-container">
            <h2>My Requests</h2>
            {error && (
                <div className="error-message" style={{
                    color: '#dc3545',
                    padding: '10px',
                    marginBottom: '20px',
                    background: '#ffebee',
                    borderRadius: '4px'
                }}>
                    {error}
                </div>
            )}
            <div className="requests-list">
                {requests.length > 0 ? (
                    requests.map(request => (
                        <div key={request.id} className={`request-card ${request.status}`}>
                            <div className="request-header">
                                <h3>{request.title}</h3>
                                <button 
                                    className="delete-btn"
                                    onClick={() => handleDelete(request.id)}
                                >
                                    🗑️
                                </button>
                            </div>
                            <p>{request.description}</p>
                            <div className="request-footer">
                                <span className="status">Status: {request.status}</span>
                                <span className="date">
                                    {new Date(request.created_at).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No requests found. Submit a new request to get started.</p>
                )}
            </div>
        </div>
    );
};

export default UserRequests; 