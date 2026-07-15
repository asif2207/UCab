import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Profile.css';

// Menu rows shown below the identity card.
// 'rider' and 'driver' share most items but a few differ.
const RIDER_MENU = [
  { icon: '🕐', label: 'My rides', to: '/history' },
  { icon: '📍', label: 'Saved places', to: '/profile/places' },
  { icon: '💳', label: 'Payment methods', to: '/profile/payments' },
  { icon: '🎟️', label: 'Coupons & offers', to: '/profile/offers' },
  { icon: '👥', label: 'Refer & earn', to: '/profile/refer' },
  { icon: '🛟', label: 'Help & support', to: '/profile/help' },
  { icon: '⚙️', label: 'Settings', to: '/profile/settings' },
];

const DRIVER_MENU = [
  { icon: '🕐', label: 'Ride history', to: '/history' },
  { icon: '🚗', label: 'Vehicle details', to: '/profile/vehicle' },
  { icon: '📄', label: 'Documents & KYC', to: '/profile/kyc' },
  { icon: '💰', label: 'Earnings', to: '/profile/earnings' },
  { icon: '🛟', label: 'Help & support', to: '/profile/help' },
  { icon: '⚙️', label: 'Settings', to: '/profile/settings' },
];

function Profile() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [confirmLogout, setConfirmLogout] = useState(false);

  const role = user?.role || 'rider'; // 'rider' | 'driver'
  const menu = role === 'driver' ? DRIVER_MENU : RIDER_MENU;
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : '?';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="profile-page">

      {/* Identity card */}
      <div className="profile-card">
        <div className="profile-avatar-lg">
          {user?.photoUrl ? (
            <img src={user.photoUrl} alt={user.name} />
          ) : (
            <span>{initial}</span>
          )}
        </div>

        <div className="profile-identity">
          <h2>{user?.name || 'Guest'}</h2>
          <span className={`role-pill role-${role}`}>
            {role === 'driver' ? 'Driver' : 'Rider'}
          </span>

          <div className="profile-meta-row">
            <span className="profile-meta-item">
              ⭐ {user?.rating ? user.rating.toFixed(1) : 'New'}
            </span>
            {user?.phone && (
              <span className="profile-meta-item">
                📱 {user.phone}
                {user?.phoneVerified && <span className="verified-dot" title="Verified" />}
              </span>
            )}
          </div>

          {user?.email && <p className="profile-email">{user.email}</p>}
        </div>
      </div>

      {/* Wallet / earnings strip */}
      <div className="profile-wallet">
        {role === 'driver' ? (
          <>
            <div className="wallet-block">
              <p className="wallet-label">Today's earnings</p>
              <p className="wallet-value">₹{user?.todayEarnings ?? '0'}</p>
            </div>
            <div className="wallet-block">
              <p className="wallet-label">Total trips</p>
              <p className="wallet-value">{user?.totalTrips ?? '0'}</p>
            </div>
          </>
        ) : (
          <>
            <div className="wallet-block">
              <p className="wallet-label">UCAB wallet</p>
              <p className="wallet-value">₹{user?.walletBalance ?? '0'}</p>
            </div>
            <div className="wallet-block">
              <p className="wallet-label">Total rides</p>
              <p className="wallet-value">{user?.totalTrips ?? '0'}</p>
            </div>
          </>
        )}
      </div>

      {/* Menu list */}
      <div className="profile-menu">
        {menu.map((item) => (
          <button
            key={item.to}
            className="profile-menu-row"
            onClick={() => navigate(item.to)}
          >
            <span className="menu-row-left">
              <span className="menu-icon">{item.icon}</span>
              <span>{item.label}</span>
            </span>
            <span className="loc-arrow">›</span>
          </button>
        ))}
      </div>

      {/* Logout */}
      <div className="profile-logout-wrap">
        {confirmLogout ? (
          <div className="logout-confirm">
            <p>Log out of UCAB?</p>
            <div className="logout-confirm-actions">
              <button className="link-btn" onClick={() => setConfirmLogout(false)}>
                Cancel
              </button>
              <button className="logout-btn" onClick={handleLogout}>
                Log out
              </button>
            </div>
          </div>
        ) : (
          <button className="profile-menu-row logout-row" onClick={() => setConfirmLogout(true)}>
            <span className="menu-row-left">
              <span className="menu-icon">🚪</span>
              <span>Log out</span>
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

export default Profile;