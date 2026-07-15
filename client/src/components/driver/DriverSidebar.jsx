import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './DriverSidebar.css';

const NAV_ITEMS = [
  { path: '/driver/dashboard', icon: '🏠', label: 'Dashboard' },
  { path: '/driver/rides', icon: '📋', label: 'My Rides' },
  { path: '/driver/earnings', icon: '💰', label: 'Earnings' },
  { path: '/driver/profile', icon: '👤', label: 'Profile' },
];

function DriverSidebar() {
  const location = useLocation();

  return (
    <aside className="driver-sidebar">
      <nav className="driver-sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar-nav-item ${
              location.pathname === item.path ? 'active' : ''
            }`}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <Link to="/" className="switch-to-rider">
          <span>🚶</span>
          <span>Switch to Rider</span>
        </Link>
      </div>
    </aside>
  );
}

export default DriverSidebar;