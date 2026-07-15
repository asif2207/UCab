import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './AdminNavbar.css';

function AdminNavbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="admin-navbar">
      <Link to="/admin/dashboard" className="admin-logo">
        UCAB<span className="admin-logo-dot">.</span>
        <span className="admin-badge">ADMIN</span>
      </Link>

      <div className="admin-navbar-right">
        <div className="admin-user">
          <div className="admin-avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="admin-name">{user?.name}</p>
            <p className="admin-role-label">Administrator</p>
          </div>
        </div>
        <button className="admin-logout-btn" onClick={handleLogout}>
          Log out
        </button>
      </div>
    </header>
  );
}

export default AdminNavbar;