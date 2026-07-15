import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllBookings, cancelBooking } from '../../services/adminService';
import { AuthContext } from '../../context/AuthContext';
import AdminLayout from '../../components/admin/AdminLayout';

const STATUS_COLORS = {
  pending: '#FFC857',
  accepted: '#2DD4BF',
  ongoing: '#60a5fa',
  completed: '#22c55e',
  cancelled: '#ef4444',
};

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') { navigate('/login'); return; }
    fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    try {
      const res = await getAllBookings();
      setBookings(res.data);
    } catch (err) {} finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await cancelBooking(id);
      fetchBookings();
    } catch (err) {
      alert('Failed to cancel booking');
    }
  };

  const filtered = bookings
    .filter((b) => filter === 'all' || b.status === filter)
    .filter((b) =>
      b.rider?.name?.toLowerCase().includes(search.toLowerCase()) ||
      b.pickupLocation?.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <AdminLayout>
      <div style={{ maxWidth: '1000px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontFamily: 'Space Grotesk,sans-serif', fontSize: '1.8rem' }}>Bookings</h1>
          <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{bookings.length} total rides</span>
        </div>

        <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Search by rider or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              background: '#161b22',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'var(--text)',
              padding: '0.7rem 1rem',
              borderRadius: '10px',
              fontSize: '0.88rem',
              fontFamily: 'Inter,sans-serif',
              flex: 1,
            }}
          />
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {['all', 'pending', 'accepted', 'ongoing', 'completed', 'cancelled'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  background: filter === f ? 'rgba(167,139,250,0.1)' : '#161b22',
                  border: `1px solid ${filter === f ? 'rgba(167,139,250,0.3)' : 'rgba(255,255,255,0.08)'}`,
                  color: filter === f ? '#a78bfa' : 'var(--muted)',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '20px',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  fontFamily: 'Inter,sans-serif',
                  textTransform: 'capitalize',
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          {loading ? (
            <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '2rem' }}>Loading...</p>
          ) : filtered.length === 0 ? (
            <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '2rem' }}>No bookings found</p>
          ) : filtered.map((booking) => (
            <div key={booking._id} style={{
              background: '#161b22',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '14px',
              padding: '1.2rem 1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.8rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontWeight: '600', fontSize: '0.9rem', marginBottom: '0.2rem' }}>
                    👤 {booking.rider?.name} · {booking.rider?.phone}
                  </p>
                  <p style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>
                    {new Date(booking.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric',
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <span style={{
                    color: STATUS_COLORS[booking.status],
                    fontSize: '0.78rem',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                  }}>
                    {booking.status}
                  </span>
                  <span style={{ color: 'var(--amber)', fontWeight: '700', fontFamily: 'Space Grotesk,sans-serif' }}>
                    ₹{booking.fare}
                  </span>
                </div>
              </div>

              <div style={{
                background: '#0d1117',
                borderRadius: '10px',
                padding: '0.8rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', flexShrink: 0, display: 'inline-block' }}></span>
                  {booking.pickupLocation}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', flexShrink: 0, display: 'inline-block' }}></span>
                  {booking.dropLocation}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '0.6rem', fontSize: '0.78rem', color: 'var(--muted)' }}>
                  <span>📍 {booking.distance} km</span>
                  <span>🚕 {booking.cabType}</span>
                  <span>{booking.paymentStatus === 'paid' ? '✅ Paid' : '⏳ Unpaid'}</span>
                  {booking.driver && <span>Driver: {booking.driver?.name}</span>}
                </div>

                {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                  <button
                    onClick={() => handleCancel(booking._id)}
                    style={{
                      background: 'rgba(239,68,68,0.1)',
                      border: '1px solid rgba(239,68,68,0.3)',
                      color: '#ef4444',
                      padding: '0.3rem 0.8rem',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                      fontFamily: 'Inter,sans-serif',
                    }}
                  >
                    Cancel Ride
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminBookings;