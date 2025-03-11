export const getMenuItems = (role) => {
    const baseItems = [
        { name: 'Home', icon: '🏠' },
        { name: 'Orders', icon: '🛒' },
        { name: 'Reports', icon: '🎟️' },
    ];

    const userItems = [
        ...baseItems,
        { name: 'Requests', icon: '📝' },
        { name: 'New Request', icon: '➕' },
        { name: 'Scan Lottery', icon: '🎰' }
    ];

    const adminItems = [
        ...baseItems,
        { name: 'Requests', icon: '📝' },
        { name: 'Scan Lottery', icon: '🎰' },
        { name: 'Inventory', icon: '📦' },
        { name: 'Customers', icon: '👥' },
        { name: 'Revenue', icon: '💰' },
        { name: 'Order-history', icon: '📈' },
        { name: 'Settings', icon: '⚙️' }
    ];

    return role === 'admin' ? adminItems : userItems;
}; 