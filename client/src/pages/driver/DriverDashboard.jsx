import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getDriverProfile,
  getPendingRides,
  acceptRide,
  rejectRide,
} from '../../services/driverService';
import { AuthContext } from '../../context/AuthContext';
import DriverLayout from '../../components/driver/DriverLayout';
import './DriverDashboard.css';

const CAB_ICONS = { mini: '🚗', sedan: '🚕', suv: '🚙' };

function DriverDashboard() {
  const [profile, setProfile] = useState(null);
  const [pendingRides, setPendingRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    fetchData();
    const interval = setInterval(fetchPending, 10000);
    return () => clearInterval(interval);
  }, [user]);

  const fetchData = async () => {
    try {
      const [profileRes, ridesRes] = await Promise.all([
        getDriverProfile(),
        getPendingRides(),
      ]);
      setProfile(profileRes.data);
      setPendingRides(ridesRes.data);
    } catch (err) {
      if (err.response?.status === 404) {
        navigate('/driver/register');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchPending = async () => {
    try {
      const res = await getPendingRides();
      setPendingRides(res.data);
    } catch (err) {}
  };

  const handleAccept = async (id) => {
    setActionLoading(id);
    try {
      await acceptRide(id);
      fetchPending();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to accept');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    setActionLoading(id);
    try {
      await rejectRide(id);
      fetchPending();
    } catch (err) {} finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <DriverLayout>
        <div className="driver-loading">Loading dashboard...</div>
      </DriverLayout>
    );
  }

  return (
    <DriverLayout>
      <div className="dashboard-content">

        {/* Welcome */}
        <div className="dashboard-welcome">
          <h1>Good {getTimeOfDay()}, {user?.name?.split(' ')[0]} 👋</h1>
          <p className="welcome-sub">
            {profile?.isAvailable
              ? 'You are online and accepting rides.'
              : 'You are offline. Go online to receive ride requests.'}
          </p>
        </div>

        {/* Stats */}
        <div className="dashboard-stats">
          <div className="stat-card amber">
            <p className="stat-icon">💰</p>
            <p className="stat-value">₹{profile?.totalEarnings || 0}</p>
            <p className="stat-label">Total Earnings</p>
          </div>
          <div className="stat-card teal">
            <p className="stat-icon">🚕</p>
            <p className="stat-value">{profile?.totalRides || 0}</p>
            <p className="stat-label">Total Rides</p>
          </div>
          <div className="stat-card blue">
            <p className="stat-icon">⭐</p>
            <p className="stat-value">{profile?.rating || '5.0'}</p>
            <p className="stat-label">Rating</p>
          </div>
          <div className="stat-card purple">
            <p className="stat-icon">🚗</p>
            <p className="stat-value">
              {profile?.vehicleType?.charAt(0).toUpperCase() +
                profile?.vehicleType?.slice(1) || '—'}
            </p>
            <p className="stat-label">Vehicle</p>
          </div>
        </div>

        {/* Vehicle info */}
        {profile && (
          <div className="vehicle-card">
            <div className="vehicle-info">
              <span className="vehicle-icon">
                {CAB_ICONS[profile.vehicleType]}
              </span>
              <div>
                <p className="vehicle-number">{profile.vehicleNumber}</p>
                <p className="vehicle-license">License: {profile.licenseNumber}</p>
              </div>
            </div>
            <div className={`verified-badge ${profile.isVerified ? 'verified' : 'pending'}`}>
              {profile.isVerified ? '✅ Verified' : '⏳ Pending Verification'}
            </div>
          </div>
        )}

        {/* Pending rides */}
        <div className="pending-section">
          <div className="pending-section-header">
            <h2>Ride Requests</h2>
            <div className="live-badge">
              <span className="live-dot"></span>
              LIVE
            </div>
          </div>

          {pendingRides.length === 0 ? (
            <div className="empty-requests">
              <div className="empty-icon-wrap">🚦</div>
              <p>Waiting for ride requests...</p>
              <p className="empty-sub">
                Make sure you're online to receive requests
              </p>
            </div>
          ) : (
            <div className="requests-grid">
              {pendingRides.map((ride) => (
                <div key={ride._id} className="request-card">
                  <div className="request-card-top">
                    <div className="request-cab-info">
                      <span className="request-cab-icon">
                        {CAB_ICONS[ride.cabType]}
                      </span>
                      <div>
                        <p className="request-cab-name">
                          {ride.cabType?.charAt(0).toUpperCase() +
                            ride.cabType?.slice(1)}
                        </p>
                        <p className="request-time">
                          {new Date(ride.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="request-fare-badge">₹{ride.fare}</div>
                  </div>

                  <div className="request-locations">
                    <div className="req-loc-row">
                      <div className="req-dot green"></div>
                      <p>{ride.pickupLocation}</p>
                    </div>
                    <div className="req-connector">
                      <div className="req-line"></div>
                    </div>
                    <div className="req-loc-row">
                      <div className="req-dot red"></div>
                      <p>{ride.dropLocation}</p>
                    </div>
                  </div>

                  <div className="request-details">
                    <span className="detail-chip">📍 {ride.distance} km</span>
                    <span className="detail-chip">👤 {ride.rider?.name}</span>
                    <span className="detail-chip">📞 {ride.rider?.phone}</span>
                  </div>

                  <div className="request-buttons">
                    <button
                      className="reject-btn"
                      onClick={() => handleReject(ride._id)}
                      disabled={actionLoading === ride._id}
                    >
                      ✕ Reject
                    </button>
                    <button
                      className="accept-btn"
                      onClick={() => handleAccept(ride._id)}
                      disabled={actionLoading === ride._id}
                    >
                      {actionLoading === ride._id ? 'Processing...' : '✓ Accept Ride'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DriverLayout>
  );
}

function getTimeOfDay() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}

export default DriverDashboard;