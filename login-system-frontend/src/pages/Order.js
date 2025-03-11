import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Order.css';

const Orders = () => {
    const [cart, setCart] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Get the user ID from localStorage
        const userData = JSON.parse(localStorage.getItem('user'));
        if (!userData) {
            navigate('/login');
            return;
        }

        // Load user-specific cart
        const allCarts = JSON.parse(localStorage.getItem('userCarts') || '{}');
        const userCart = allCarts[userData.id] || [];
        setCart(userCart);
    }, [navigate]);

    const calculateTotal = () => {
        return cart.reduce((total, item) => {
            const price = parseFloat(item.price.replace('$', ''));
            return total + (price * item.quantity);
        }, 0);
    };

    const handleQuantityChange = (ticketId, newQuantity) => {
        const userData = JSON.parse(localStorage.getItem('user'));
        const userId = userData.id;
        
        // Get all carts
        const allCarts = JSON.parse(localStorage.getItem('userCarts') || '{}');
        
        // Update the specific user's cart
        const updatedCart = cart.map(item => 
            item.id === ticketId ? { ...item, quantity: parseInt(newQuantity) } : item
        ).filter(item => item.quantity > 0);
        
        // Save back to localStorage
        allCarts[userId] = updatedCart;
        localStorage.setItem('userCarts', JSON.stringify(allCarts));
        
        setCart(updatedCart);
    };

    const handleCheckout = async () => {
        try {
            const token = localStorage.getItem('token');
            
            // Format the items for the backend
            const formattedItems = cart.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price.replace('$', ''), // Remove $ sign
                quantity: parseInt(item.quantity)
            }));

            const orderData = {
                items: formattedItems,
                totalAmount: calculateTotal()
            };

            console.log('Sending order data:', orderData);

            const response = await axios.post(
                'http://localhost:5000/api/orders/create',
                orderData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('Order response:', response.data);

            if (response.data.success) {
                // Clear only this user's cart
                const userData = JSON.parse(localStorage.getItem('user'));
                const allCarts = JSON.parse(localStorage.getItem('userCarts') || '{}');
                delete allCarts[userData.id];
                localStorage.setItem('userCarts', JSON.stringify(allCarts));
                
                setCart([]);
                alert('Order placed successfully!');
                navigate('/order-history');
            } else {
                throw new Error(response.data.message || 'Failed to place order');
            }
        } catch (error) {
            console.error('Checkout error:', error);
            console.error('Error details:', error.response?.data);
            alert(error.response?.data?.message || 'Error placing order. Please try again.');
        }
    };

    return (
        <div className="order-container">
            <h2>Your Cart</h2>
            {cart.length === 0 ? (
                <p>Your cart is empty</p>
            ) : (
                <>
                    <div className="cart-items">
                        {cart.map((item) => (
                            <div key={item.id} className="cart-item">
                                <img src={item.image} alt={item.name} className="cart-item-image" />
                                <div className="cart-item-details">
                                    <h3>{item.name}</h3>
                                    <p>Price: {item.price}</p>
                                    <div className="quantity-control">
                                        <label>Quantity: </label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={item.quantity}
                                            onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="cart-summary">
                        <h3>Total: ${calculateTotal().toFixed(2)}</h3>
                        <button className="checkout-button" onClick={handleCheckout}>
                            Proceed to Checkout
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Orders;
