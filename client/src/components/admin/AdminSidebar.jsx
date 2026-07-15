import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './AdminSidebar.css';

const NAV_ITEMS = [
  { path: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
  { path: '/admin/users', icon: '👥', label: 'Users' },
  { path: '/admin/drivers', icon: '🚕', label: 'Drivers' },
  { path: '/admin/bookings', icon: '📋', label: 'Bookings' },
  { path: '/admin/payments', icon: '💰', label: 'Payments' },
];

function AdminSidebar() {
  const location = useLocation();

  return (
    <aside className="admin-sidebar">
      <nav className="admin-sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`admin-nav-item ${
              location.pathname === item.path ? 'active' : ''
            }`}
          >
            <span className="admin-nav-icon">{item.icon}</span>
            <span className="admin-nav-label">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="admin-sidebar-footer">
        <Link to="/" className="back-to-app">
          <span>←</span>
          <span>Back to App</span>
        </Link>
      </div>
    </aside>
  );
}

export default AdminSidebar;