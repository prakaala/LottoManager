import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './Customers.css';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users');
        console.log('Fetched data:', response.data); // Debug log
        setCustomers(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching customers:', err);
        setError('Failed to fetch customers');
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  if (loading) return <div className="customers-loading">Loading...</div>;
  if (error) return <div className="customers-error">{error}</div>;

  return (
    <div className="customers-container">
      <div className="customers-header">
        <h2>Registered Users</h2>
        <div className="customers-count">
          Total Users: {customers.length}
        </div>
      </div>
      <div className="customers-table-container">
        <table className="customers-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>User ID</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td>
                  <div className="customer-name">
                    <div className="customer-avatar">
                      {customer.username.charAt(0).toUpperCase()}
                    </div>
                    {customer.username}
                  </div>
                </td>
                <td>{customer.email}</td>
                <td>#{customer.id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Customers;