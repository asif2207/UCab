import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDriverRides, updateRideStatus } from '../../services/driverService';
import { AuthContext } from '../../context/AuthContext';
import DriverLayout from '../../components/driver/DriverLayout';
import './DriverRides.css';

const STATUS_COLORS = {
  pending: '#FFC857',
  accepted: '#2DD4BF',
  ongoing: '#60a5fa',
  completed: '#22c55e',
  cancelled: '#ef4444',
};

const NEXT_STATUS = {
  accepted: 'ongoing',
  ongoing: 'completed',
};

const NEXT_STATUS_LABEL = {
  accepted: '▶ Start Ride',
  ongoing: '✓ Complete Ride',
};

function DriverRides() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [filter, setFilter] = useState('all');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    fetchRides();
  }, [user]);

  const fetchRides = async () => {
    try {
      const res = await getDriverRides();
      setRides(res.data);
    } catch (err) {
      console.error('Failed to fetch rides');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    setActionLoading(id);
    try {
      await updateRideStatus(id, status);
      fetchRides();
    } catch (err) {
      alert('Failed to update status');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredRides = filter === 'all'
    ? rides
    : rides.filter((r) => r.status === filter);

  return (
    <DriverLayout>
      <div className="driver-rides-content">
        <h1 className="driver-rides-title">My Rides</h1>

        {/* Filter tabs */}
        <div className="rides-filter-tabs">
          {['all', 'accepted', 'ongoing', 'completed', 'cancelled'].map((f) => (
            <button
              key={f}
              className={`filter-tab ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {loading && <p className="rides-loading">Loading rides...</p>}

        {!loading && filteredRides.length === 0 && (
          <div className="no-rides-state">
            <p>🚕</p>
            <p>No rides found</p>
          </div>
        )}

        <div className="driver-rides-list">
          {filteredRides.map((ride) => (
            <div key={ride._id} className="driver-ride-card">
              <div className="driver-ride-header">
                <div>
                  <p className="driver-ride-date">
                    {new Date(ride.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                  <p className="rider-name">👤 {ride.rider?.name} · {ride.rider?.phone}</p>
                </div>
                <span
                  className="driver-ride-status"
                  style={{ color: STATUS_COLORS[ride.status] }}
                >
                  {ride.status?.charAt(0).toUpperCase() + ride.status?.slice(1)}
                </span>
              </div>

              <div className="driver-ride-route">
                <div className="drr-row">
                  <span className="drr-dot green"></span>
                  <p>{ride.pickupLocation}</p>
                </div>
                <div className="drr-line"></div>
                <div className="drr-row">
                  <span className="drr-dot red"></span>
                  <p>{ride.dropLocation}</p>
                </div>
              </div>

              <div className="driver-ride-footer">
                <div className="driver-ride-meta">
                  <span>📍 {ride.distance} km</span>
                  <span className="fare-highlight">₹{ride.fare}</span>
                  <span className={ride.paymentStatus === 'paid' ? 'paid' : 'unpaid'}>
                    {ride.paymentStatus === 'paid' ? '✅ Paid' : '⏳ Unpaid'}
                  </span>
                </div>

                {NEXT_STATUS[ride.status] && (
                  <button
                    className="status-update-btn"
                    onClick={() => handleStatusUpdate(ride._id, NEXT_STATUS[ride.status])}
                    disabled={actionLoading === ride._id}
                  >
                    {actionLoading === ride._id ? 'Updating...' : NEXT_STATUS_LABEL[ride.status]}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DriverLayout>
  );
}

export default DriverRides;