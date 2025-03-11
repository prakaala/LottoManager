import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './OrderHistory.css';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('/api/orders/user-orders', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.data.success) {
                    setOrders(response.data.orders);
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
                alert('Error loading order history');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const getStatusClass = (status) => {
        switch (status) {
            case 'completed':
                return 'status-completed';
            case 'pending':
                return 'status-pending';
            case 'cancelled':
                return 'status-cancelled';
            default:
                return '';
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="order-history-container">
            <h2>Order History</h2>
            {orders.length === 0 ? (
                <p>No orders found</p>
            ) : (
                <div className="orders-list">
                    {orders.map((order) => (
                        <div key={order.id} className="order-card">
                            <div className="order-header">
                                <h3>Order #{order.id}</h3>
                                <span className={`status ${getStatusClass(order.status)}`}>
                                    {order.status}
                                </span>
                            </div>
                            <div className="order-details">
                                <p>Total Amount: ${order.total_amount}</p>
                                <p>Date: {new Date(order.created_at).toLocaleDateString()}</p>
                            </div>
                            <div className="order-items">
                                {order.items.split(',').map((item, index) => {
                                    const [name, quantity] = item.split(':');
                                    return (
                                        <div key={index} className="order-item">
                                            <span>{name}</span>
                                            <span>x{quantity}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderHistory; 