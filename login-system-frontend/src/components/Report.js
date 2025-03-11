import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Reports.css';

const lotteryTickets = [
    { id: 1, name: 'Spicy Hot Cash', price: '$1', image: '/lottery-images/Spicy-Hot-Cash.jpg', maxPrize: '$30,000' },
    { id: 2, name: 'Trump Card', price: '$3', image: '/lottery-images/The-Trump-Card.jpg', maxPrize: '$50,000' },
    { id: 3, name: 'Snow Bored', price: '$2', image: '/lottery-images/snowbored.jpg', maxPrize: '$10,000' },
    { id: 4, name: 'Win for Life', price: '$3', image: '/lottery-images/winlife.jpeg', maxPrize: '$1,000,000' },
    { id: 5, name: 'Lucky 7', price: '$2', image: '/lottery-images/lucky7.png', maxPrize: '$77,777' },
    { id: 6, name: 'Holiday Doubler', price: '$2', image: '/lottery-images/Spicy-Hot-Cash.jpg', maxPrize: '$10,000' },
    { id: 7, name: '25 the Money', price: '$2', image: '/lottery-images/Spicy-Hot-Cash.jpg', maxPrize: '$20,000' },
    { id: 8, name: 'Hit $50', price: '$2', image: '/lottery-images/Spicy-Hot-Cash.jpg', maxPrize: '$50,000' },
    { id: 9, name: 'Hit $50', price: '$2', image: '/lottery-images/Spicy-Hot-Cash.jpg', maxPrize: '$50,000' },  
    { id: 10, name: 'Hit $50', price: '$2', image: '/lottery-images/Spicy-Hot-Cash.jpg', maxPrize: '$50,000' },
    { id: 11, name: 'Hit $50', price: '$2', image: '/lottery-images/Spicy-Hot-Cash.jpg', maxPrize: '$50,000' },
    { id: 12, name: 'Hit $50', price: '$2', image: '/lottery-images/Spicy-Hot-Cash.jpg', maxPrize: '$50,000' },
    { id: 13, name: 'Hit $50', price: '$2', image: '/lottery-images/Spicy-Hot-Cash.jpg', maxPrize: '$50,000' },
    { id: 14, name: 'Hit $50', price: '$2', image: '/lottery-images/Spicy-Hot-Cash.jpg', maxPrize: '$50,000' },
    { id: 15, name: 'Hit $50', price: '$2', image: '/lottery-images/Spicy-Hot-Cash.jpg', maxPrize: '$50,000' },
    
];

const Reports = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPrice, setSelectedPrice] = useState('all');
    const [cart, setCart] = useState([]);
    const navigate = useNavigate();
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handlePriceChange = (event) => {
        setSelectedPrice(event.target.value);
    };

    const handlePurchase = (ticket) => {
        if (!user) {
            alert('Please login to purchase tickets');
            return;
        }
        
        // Get the user ID from localStorage
        const userData = JSON.parse(localStorage.getItem('user'));
        const userId = userData.id;
        
        // Get existing cart data
        const allCarts = JSON.parse(localStorage.getItem('userCarts') || '{}');
        const userCart = allCarts[userId] || [];
        
        // Update the user's cart
        const existingTicket = userCart.find(item => item.id === ticket.id);
        
        if (existingTicket) {
            existingTicket.quantity += 1;
        } else {
            userCart.push({ ...ticket, quantity: 1 });
        }
        
        // Save updated cart back to localStorage
        allCarts[userId] = userCart;
        localStorage.setItem('userCarts', JSON.stringify(allCarts));
        
        const proceed = window.confirm(`Added "${ticket.name}" to cart! Go to cart?`);
        if (proceed) {
            // navigate('/orders');
        }
    };

    const testPurchase = async () => {
        try {
            const testTicket = {
                id: 1,
                name: 'Test Ticket',
                price: '$2',
                quantity: 1
            };
            
            const token = localStorage.getItem('token');
            const response = await axios.post('/api/orders/create', 
                {
                    tickets: [testTicket],
                    totalAmount: 2
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            
            console.log('Purchase response:', response.data);
            alert('Test purchase successful!');
        } catch (error) {
            console.error('Purchase error:', error);
            alert('Purchase failed: ' + (error.response?.data?.error || error.message));
        }
    };

    const testOrderSystem = async () => {
        try {
            // First test the connection
            const testResponse = await axios.get('/api/orders/test');
            console.log('Test response:', testResponse.data);

            // Then test order creation
            const token = localStorage.getItem('token');
            const orderResponse = await axios.post('/api/orders/create', 
                {
                    tickets: [{
                        id: 1,
                        name: 'Test Ticket',
                        price: '$2',
                        quantity: 1
                    }],
                    totalAmount: 2
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            
            console.log('Order creation response:', orderResponse.data);
            alert('Order system test successful!');
        } catch (error) {
            console.error('Order system test error:', error);
            alert('Order system test failed: ' + (error.response?.data?.message || error.message));
        }
    };

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/orders/user-orders', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            setOrders(response.data.orders);
            console.log('Orders:', response.data.orders);
        } catch (error) {
            console.error('Error fetching orders:', error);
            alert('Error fetching orders: ' + (error.response?.data?.message || error.message));
        }
    };

    const filteredTickets = lotteryTickets.filter((ticket) => {
        const matchesSearch = ticket.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPrice = selectedPrice === 'all' || ticket.price === `$${selectedPrice}`;
        return matchesSearch && matchesPrice;
    });

    return (
        <div className="reports-container">
            <div className="reports-header">
                <h2>Lottery Tickets</h2>
                <div className="filter-section">
                    <input 
                        type="text" 
                        placeholder="Search tickets..." 
                        className="search-input" 
                        value={searchTerm} 
                        onChange={handleSearchChange} 
                    />
                    <select className="filter-select" value={selectedPrice} onChange={handlePriceChange}>
                        <option value="all">All Prices</option>
                        <option value="1">$1 Tickets</option>
                        <option value="2">$2 Tickets</option>
                        <option value="3">$3 Tickets</option>
                    </select>
                </div>
            </div>
            
            <div className="lottery-grid">
                {filteredTickets.length > 0 ? (
                    filteredTickets.map((ticket) => (
                        <div key={ticket.id} className="lottery-card">
                            <div className="lottery-image">
                                <img src={ticket.image} alt={ticket.name} />
                                <div className="price-tag">{ticket.price}</div>
                            </div>
                            <div className="lottery-info">
                                <h3>{ticket.name}</h3>
                                <p>Max Prize: {ticket.maxPrize}</p>
                                <button 
                                    className="buy-button" 
                                    onClick={() => handlePurchase(ticket)}
                                >
                                    Buy Now
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="no-results">No tickets found</p>
                )}
            </div>
            <button onClick={testPurchase}>Test Purchase</button>
            <button onClick={testOrderSystem}>Test Order System</button>
            <div>
                <button onClick={fetchOrders}>View Orders</button>
                {orders.length > 0 && (
                    <div className="orders-list">
                        <h3>Your Orders</h3>
                        {orders.map(order => (
                            <div key={order.id} className="order-item">
                                <p>Order #{order.id}</p>
                                <p>Total: ${order.total_amount}</p>
                                <p>Status: {order.status}</p>
                                <p>Date: {new Date(order.created_at).toLocaleDateString()}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Reports;
