import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';
import './SalesStats.css';

const SalesStats = () => {
    const [salesData, setSalesData] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchSalesData();
        fetchAllOrders();
    }, []);

    const fetchSalesData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/orders/stats', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setSalesData(response.data.stats);
            }
        } catch (error) {
            console.error('Error fetching sales data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAllOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/orders/all', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setOrders(response.data.orders);
            } else {
                setError('Failed to fetch orders');
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            setError(error.response?.data?.message || 'Error fetching orders');
        }
    };

    const handleDeleteOrder = async (orderId) => {
        if (!window.confirm('Are you sure you want to delete this order?')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/orders/${orderId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // Refresh data after deletion
            fetchAllOrders();
            fetchSalesData();
        } catch (error) {
            console.error('Error deleting order:', error);
            alert('Failed to delete order');
        }
    };

    // Add this helper function for safe calculations
    const calculateStats = () => {
        if (!salesData || salesData.length === 0) {
            return {
                totalSales: 0,
                totalOrders: 0,
                averageOrderValue: 0
            };
        }

        const totalSales = salesData.reduce((sum, month) => 
            sum + (parseFloat(month.totalSales) || 0), 0);
        const totalOrders = salesData.reduce((sum, month) => 
            sum + (parseInt(month.totalOrders) || 0), 0);
        const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

        return {
            totalSales,
            totalOrders,
            averageOrderValue
        };
    };

    const formatItems = (items) => {
        if (!items) return 'No items';
        return items.split(',').map(item => item.trim()).join(', ');
    };

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (loading) return <div>Loading sales data...</div>;

    const stats = calculateStats();

    return (
        <div className="sales-stats">
            <h3>Sales Overview</h3>
            <div className="stats-grid">
                <div className="stat-card">
                    <h4>Total Sales</h4>
                    <p>${stats.totalSales.toFixed(2)}</p>
                </div>
                <div className="stat-card">
                    <h4>Total Orders</h4>
                    <p>{stats.totalOrders}</p>
                </div>
                <div className="stat-card">
                    <h4>Average Order Value</h4>
                    <p>${stats.averageOrderValue.toFixed(2)}</p>
                </div>
            </div>
            
            <div className="sales-chart">
                <LineChart width={800} height={400} data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="totalSales" stroke="#8884d8" />
                    <Line type="monotone" dataKey="totalOrders" stroke="#82ca9d" />
                </LineChart>
            </div>

            <div className="orders-section">
                <h3>All Orders</h3>
                {orders.length === 0 ? (
                    <p>No orders found</p>
                ) : (
                    <div className="table-responsive">
                        <table className="orders-table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>User</th>
                                    <th>Items</th>
                                    <th>Total Amount</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order.id}>
                                        <td>#{order.id}</td>
                                        <td>{order.username}</td>
                                        <td>{formatItems(order.items)}</td>
                                        <td>${parseFloat(order.total_amount).toFixed(2)}</td>
                                        <td>{new Date(order.created_at).toLocaleDateString()}</td>
                                        <td>
                                            <span className={`status status-${order.status}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td>
                                            <button 
                                                onClick={() => handleDeleteOrder(order.id)}
                                                className="delete-btn"
                                                title="Delete Order"
                                            >
                                                🚫 Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SalesStats; 