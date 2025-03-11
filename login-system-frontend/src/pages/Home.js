import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminRequests from '../components/AdminRequests';
import BarcodeScanner from '../components/BarcodeScanner';
import Customers from '../components/Customers';
import Reports from '../components/Report';
import RequestForm from '../components/RequestForm';
import SalesStats from '../components/SalesStats';
import UserRequests from '../components/UserRequests';
import { getMenuItems } from '../utils/menuItems';
import './HomePage.css';
import Orders from './Order';
import OrderHistory from './OrderHistory';

const HomePage = () => {
  const [activeItem, setActiveItem] = useState('Home');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [activeContent, setActiveContent] = useState('Home');
  const [userRole, setUserRole] = useState('user');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        const user = JSON.parse(storedUser);
        console.log('Loading user data:', user);
        setUserName(user.username);
        setUserEmail(user.email);
        setUserRole(user.role);
        console.log('Set user role to:', user.role);
    } else {
        navigate('/login');
    }
  }, [navigate]);

  // 
  useEffect(() => {
    console.log('Current user role:', userRole);
  }, [userRole]);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileMenu && !event.target.closest('.profile-dropdown')) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProfileMenu]);

  const handleLogout = () => {
    console.log('Logging out user with role:', userRole);
    localStorage.clear(); // Clear all localStorage
    navigate('/login');
  };

  const handleMenuClick = (itemName) => {
    setActiveItem(itemName);
    setActiveContent(itemName);
  };

  // Separate stats for admin and user
  const adminStats = [
    { title: 'Orders Per Month', value: '330', change: '-11%', period: 'vs prev month', trending: 'down' },
    { title: 'Total Customer', value: '109', change: '+35%', period: 'vs prev year', trending: 'up' },
    { title: 'Total Product', value: '607', change: '+10%', period: 'vs prev month', trending: 'up' },
    { title: 'Total Visitors', value: '1200', change: '+30%', period: 'vs prev week', trending: 'up' }
  ];

  const userStats = [
    { title: 'Your Orders', value: '12', change: '+2', period: 'this month', trending: 'up' },
    { title: 'Total Spent', value: '$230', change: '+$45', period: 'vs last month', trending: 'up' },
    { title: 'Active Tickets', value: '5', change: '2 new', period: 'this week', trending: 'up' }
  ];

  const renderContent = () => {
    if (['Customers', 'Revenue', 'Growth', 'Inventory', 'Settings'].includes(activeContent)) {
      if (userRole !== 'admin') {
        return (
          <div className="access-denied">
            <h3>Access Denied</h3>
            <p>This section is only available to administrators.</p>
          </div>
        );
      }
    }

    switch (activeContent) {
      case 'Order-history':
        return <OrderHistory />;
      case 'Reports':
        return <Reports />;
      case 'Orders':
        return <Orders />;
      case 'Customers':
        return userRole === 'admin' ? <Customers /> : <div>Access Denied</div>;
      case 'Requests':
        return userRole === 'admin' ? <AdminRequests /> : <UserRequests />;
      case 'New Request':
        return <RequestForm />;
      case 'Scan Lottery':
        return <BarcodeScanner />;
      case 'Revenue':
        return <SalesStats />;
      case 'Home':
        return (
          <div className="dashboard-content">
            {/* Stats Grid */}
            <div className="stats-grid">
              {(userRole === 'admin' ? adminStats : userStats).map((stat, index) => (
                <div key={index} className="stat-card">
                  <div className="stat-content">
                    <span className="stat-title">{stat.title}</span>
                    <span className="stat-value">{stat.value}</span>
                    <div className="stat-change">
                      <span className={`change-value ${stat.trending}`}>
                        {stat.change}
                      </span>
                      <span className="change-period">{stat.period}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Admin-specific content */}
            {userRole === 'admin' && (
              <div className="admin-dashboard">
                <div className="charts-grid">
                  <div className="chart-card">
                    <h2>Sales Growth Over The Year</h2>
                    <div className="chart-container">
                      {/* Chart placeholder */}
                    </div>
                  </div>
                  <div className="chart-card">
                    <h2>Visitors</h2>
                    <div className="chart-container">
                      {/* Chart placeholder */}
                    </div>
                  </div>
                  <div className="chart-card">
                    <h2>Product Growth</h2>
                    <div className="chart-container">
                      {/* Chart placeholder */}
                    </div>
                  </div>
                  <div className="chart-card">
                    <h2>Customer Growth</h2>
                    <div className="chart-container">
                      {/* Chart placeholder */}
                    </div>
                  </div>
                </div>
                <div className="admin-actions">
                  <h3>Quick Actions</h3>
                  <button onClick={() => setActiveContent('Requests')}>
                    View Service Requests
                  </button>
                  <button onClick={() => setActiveContent('Customers')}>
                    Manage Customers
                  </button>
                </div>
              </div>
            )}

            {/* User-specific content */}
            {userRole !== 'admin' && (
              <div className="user-dashboard">
                <div className="recent-orders">
                  <h3>Your Recent Requests</h3>
                  <UserRequests />
                </div>
                <div className="quick-actions">
                  <h3>Quick Actions</h3>
                  <button onClick={() => setActiveContent('New Request')}>
                    Request New Service
                  </button>
                  <button onClick={() => setActiveContent('Requests')}>
                    View My Requests
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      default:
        return <div>Select a menu item</div>;
    }
  };

  const debugInfo = process.env.NODE_ENV === 'development' && (
    <div style={{
        position: 'fixed',
        bottom: 10,
        right: 10,
        background: '#333',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        zIndex: 9999
    }}>
        Role: {userRole}
    </div>
  );

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo">
          {userRole === 'admin' ? 'Admin Dashboard' : 'User Dashboard'}
        </div>
        <div className="profile-section">
          <div className="user-avatar">
            {userName ? userName.charAt(0).toUpperCase() : 'U'}
          </div>
          <span className="user-name">{userName || 'Guest'}</span>
          <span className="user-role">{userRole}</span>
        </div>
        <nav className="nav-menu">
          {getMenuItems(userRole).map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveContent(item.name)}
              className={`menu-item ${activeContent === item.name ? 'active' : ''}`}
            >
              <span className="menu-icon">{item.icon}</span>
              <span className="menu-text">{item.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <header className="header">
          <h1>{activeContent}</h1>
          <div className="header-right">
            <div className="profile-dropdown">
              <button 
                className="profile-trigger"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <div className="user-avatar">{userName ? userName.charAt(0).toUpperCase() : 'U'}</div>
                <span className="user-name">{userName || 'Guest'}</span>
                <span className="dropdown-arrow">▼</span>
              </button>
              
              {showProfileMenu && (
                <div className="profile-menu">
                  <div className="profile-header">
                    <div className="user-avatar">
                      {userName ? userName.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="user-info">
                      <span className="user-name">{userName || 'Guest'}</span>
                      <span className="user-email">{userEmail || 'No email'}</span>
                    </div>
                  </div>
                  <div className="profile-menu-items">
                    <button onClick={() => handleMenuClick('Profile')}>
                      <span className="menu-icon">👤</span> My Profile
                    </button>
                    <button onClick={() => handleMenuClick('Settings')}>
                      <span className="menu-icon">⚙️</span> Settings
                    </button>
                    <button onClick={handleLogout}>
                      <span className="menu-icon">🚪</span> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>
        {renderContent()}
        {debugInfo}
      </div>
    </div>
  );
};

export default HomePage;












