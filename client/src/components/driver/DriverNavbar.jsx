import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './DriverNavbar.css';

function DriverNavbar({ isAvailable, onToggle }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="driver-navbar">
      <div className="driver-navbar-left">
        <Link to="/driver/dashboard" className="driver-logo">
          UCAB<span className="driver-logo-dot">.</span>
          <span className="driver-badge">DRIVER</span>
        </Link>
      </div>

      <div className="driver-navbar-center">
        <div
          className={`availability-pill ${isAvailable ? 'online' : 'offline'}`}
          onClick={onToggle}
        >
          <span className={`availability-indicator ${isAvailable ? 'online' : 'offline'}`}></span>
          <span>{isAvailable ? 'Online' : 'Offline'}</span>
          <span className="toggle-text">Tap to {isAvailable ? 'go offline' : 'go online'}</span>
        </div>
      </div>

      <div className="driver-navbar-right">
        <div className="driver-user-info">
          <div className="driver-avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="driver-user-details">
            <p className="driver-user-name">{user?.name?.split(' ')[0]}</p>
            <p className="driver-user-role">Driver</p>
          </div>
        </div>
        <button className="driver-logout-btn" onClick={handleLogout}>
          Log out
        </button>
      </div>
    </header>
  );
}

export default DriverNavbar;