import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyRides, cancelRide } from '../services/bookingService';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import './BookingHistory.css';

const STATUS_COLORS = {
  pending: '#FFC857',
  accepted: '#2DD4BF',
  ongoing: '#60a5fa',
  completed: '#22c55e',
  cancelled: '#ef4444',
};

const CAB_ICONS = {
  mini: '🚗',
  sedan: '🚕',
  suv: '🚙',
};

function BookingHistory() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchRides();
  }, [user]);

  const fetchRides = async () => {
    try {
      const res = await getMyRides();
      setRides(res.data);
    } catch (err) {
      setError('Failed to load rides');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    try {
      await cancelRide(id);
      fetchRides();
    } catch (err) {
      alert('Failed to cancel ride');
    }
  };

  return (
    <div className="history-page">
      <Navbar />
      <div className="history-content">
        <h1>My Rides</h1>
        <p className="history-subtext">Your complete ride history.</p>

        {loading && <p className="history-loading">Loading rides...</p>}
        {error && <p className="history-error">{error}</p>}

        {!loading && rides.length === 0 && (
          <div className="history-empty">
            <p className="empty-icon">🚕</p>
            <p>No rides yet.</p>
            <button
              className="btn-primary"
              onClick={() => navigate('/booking')}
            >
              Book your first ride
            </button>
          </div>
        )}

        <div className="rides-list">
          {rides.map((ride) => (
            <div key={ride._id} className="ride-card">
              <div className="ride-card-header">
                <div className="ride-cab-type">
                  <span className="cab-icon-lg">
                    {CAB_ICONS[ride.cabType] || '🚗'}
                  </span>
                  <div>
                    <p className="cab-type-label">
                      {ride.cabType?.charAt(0).toUpperCase() + ride.cabType?.slice(1)}
                    </p>
                    <p className="ride-date">
                      {new Date(ride.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
                <span
                  className="ride-status"
                  style={{ color: STATUS_COLORS[ride.status] }}
                >
                  {ride.status?.charAt(0).toUpperCase() + ride.status?.slice(1)}
                </span>
              </div>

              <div className="ride-route">
                <div className="ride-route-row">
                  <span className="route-dot green"></span>
                  <p className="route-text">{ride.pickupLocation}</p>
                </div>
                <div className="route-dashed-line"></div>
                <div className="ride-route-row">
                  <span className="route-dot red"></span>
                  <p className="route-text">{ride.dropLocation}</p>
                </div>
              </div>

              <div className="ride-card-footer">
                <div className="ride-meta">
                  {ride.distance && (
                    <span className="meta-pill">📍 {ride.distance} km</span>
                  )}
                  <span className="meta-pill">₹{ride.fare}</span>
                  <span className="meta-pill">
                    {ride.paymentStatus === 'paid' ? '✅ Paid' : '⏳ Unpaid'}
                  </span>
                </div>

                <div className="ride-actions">
                  {ride.status !== 'cancelled' && ride.status !== 'completed' && (
  <button
    className="track-btn"
    onClick={() => navigate(`/tracking?rideId=${ride._id}`)}
  >
    Track
  </button>
)}
                  {ride.status === 'pending' && (
                    <button
                      className="cancel-btn"
                      onClick={() => handleCancel(ride._id)}
                    >
                      Cancel
                    </button>
                  )}
                  {ride.paymentStatus !== 'paid' && ride.status !== 'cancelled' && (
                    <button
                      className="pay-now-btn"
                      onClick={() => navigate(`/payment?rideId=${ride._id}`)}
                    >
                      Pay Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BookingHistory;