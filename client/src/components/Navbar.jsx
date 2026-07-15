import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : '?';

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        UCAB<span className="logo-dot">.</span>
      </Link>

      <div className="nav-links">
        {user ? (
          <>
            <Link to="/history" className="btn-ghost">My Rides</Link>
            <Link to="/profile" className="profile-avatar" title={user.name}>
              {initial}
            </Link>
            <button onClick={handleLogout} className="btn-ghost">
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn-ghost">Log in</Link>
            <Link to="/register" className="btn-primary">Get started</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;