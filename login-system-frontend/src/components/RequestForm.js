import axios from 'axios';
import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import './RequestForm.css';

const RequestForm = () => {
    const [request, setRequest] = useState({
        title: '',
        description: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                'http://localhost:5000/api/requests/create',
                request,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setMessage('Request submitted successfully!');
            setRequest({ title: '', description: '' });
        } catch (error) {
            setMessage('Failed to submit request. Please try again.');
            console.error('Request submission error:', error);
        }
        setLoading(false);
    };

    return (
        <div className="request-form-container">
            <h2>Submit New Request</h2>
            {message && <div className="alert alert-info">{message}</div>}
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Request Title</Form.Label>
                    <Form.Control
                        type="text"
                        value={request.title}
                        onChange={(e) => setRequest({...request, title: e.target.value})}
                        required
                        placeholder="Enter request title"
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={request.description}
                        onChange={(e) => setRequest({...request, description: e.target.value})}
                        required
                        placeholder="Describe your request"
                    />
                </Form.Group>

                <Button 
                    type="submit" 
                    disabled={loading}
                    className="submit-button"
                >
                    {loading ? 'Submitting...' : 'Submit Request'}
                </Button>
            </Form>
        </div>
    );
};

export default RequestForm; 