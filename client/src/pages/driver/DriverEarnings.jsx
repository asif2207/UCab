import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDriverProfile, getDriverRides } from '../../services/driverService';
import { AuthContext } from '../../context/AuthContext';
import DriverLayout from '../../components/driver/DriverLayout';

function DriverEarnings() {
  const [profile, setProfile] = useState(null);
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const [profileRes, ridesRes] = await Promise.all([
        getDriverProfile(),
        getDriverRides(),
      ]);
      setProfile(profileRes.data);
      setRides(ridesRes.data.filter((r) => r.status === 'completed'));
    } catch (err) {} finally {
      setLoading(false);
    }
  };

  const todayEarnings = rides
    .filter((r) => new Date(r.createdAt).toDateString() === new Date().toDateString())
    .reduce((sum, r) => sum + r.fare, 0);

  const weekEarnings = rides
    .filter((r) => (new Date() - new Date(r.createdAt)) / (1000 * 60 * 60 * 24) <= 7)
    .reduce((sum, r) => sum + r.fare, 0);

  return (
    <DriverLayout>
      <div style={{ maxWidth: '700px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.8rem' }}>
          Earnings
        </h1>

        {/* Overview cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          {[
            { label: 'Today', value: `₹${todayEarnings}`, color: 'rgba(255,200,87,0.1)', border: 'rgba(255,200,87,0.2)' },
            { label: 'This Week', value: `₹${weekEarnings}`, color: 'rgba(45,212,191,0.1)', border: 'rgba(45,212,191,0.2)' },
            { label: 'All Time', value: `₹${profile?.totalEarnings || 0}`, color: 'rgba(96,165,250,0.1)', border: 'rgba(96,165,250,0.2)' },
          ].map((s) => (
            <div key={s.label} style={{
              background: s.color,
              border: `1px solid ${s.border}`,
              borderRadius: '14px',
              padding: '1.3rem',
              textAlign: 'center',
            }}>
              <p style={{ fontFamily: 'Space Grotesk,sans-serif', fontSize: '1.6rem', fontWeight: '700', color: 'var(--text)', marginBottom: '0.3rem' }}>
                {s.value}
              </p>
              <p style={{ color: 'var(--muted)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '14px',
          padding: '1.2rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-around',
        }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontFamily: 'Space Grotesk,sans-serif', fontSize: '1.4rem', fontWeight: '700', color: 'var(--amber)' }}>
              {rides.length}
            </p>
            <p style={{ color: 'var(--muted)', fontSize: '0.78rem', marginTop: '0.3rem' }}>Completed Rides</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontFamily: 'Space Grotesk,sans-serif', fontSize: '1.4rem', fontWeight: '700', color: 'var(--teal)' }}>
              ⭐ {profile?.rating || '5.0'}
            </p>
            <p style={{ color: 'var(--muted)', fontSize: '0.78rem', marginTop: '0.3rem' }}>Rating</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontFamily: 'Space Grotesk,sans-serif', fontSize: '1.4rem', fontWeight: '700', color: 'var(--text)' }}>
              ₹{rides.length > 0 ? Math.round(profile?.totalEarnings / rides.length) : 0}
            </p>
            <p style={{ color: 'var(--muted)', fontSize: '0.78rem', marginTop: '0.3rem' }}>Avg Per Ride</p>
          </div>
        </div>

        {/* Rides list */}
        <h2 style={{ fontFamily: 'Space Grotesk,sans-serif', fontSize: '1.1rem' }}>
          Completed Rides
        </h2>

        {rides.length === 0 ? (
          <div style={{
            background: 'var(--surface)',
            borderRadius: '14px',
            padding: '3rem',
            textAlign: 'center',
            color: 'var(--muted)',
          }}>
            No completed rides yet
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {rides.map((ride) => (
              <div key={ride._id} style={{
                background: 'var(--surface)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '12px',
                padding: '1rem 1.2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <div>
                  <p style={{ fontSize: '0.88rem', marginBottom: '0.3rem', color: 'var(--text)' }}>
                    {ride.pickupLocation} → {ride.dropLocation}
                  </p>
                  <p style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>
                    {new Date(ride.createdAt).toLocaleDateString('en-IN')} · {ride.distance} km · {ride.rider?.name}
                  </p>
                </div>
                <p style={{
                  fontFamily: 'Space Grotesk,sans-serif',
                  fontWeight: '700',
                  color: 'var(--amber)',
                  fontSize: '1.1rem',
                  flexShrink: 0,
                }}>
                  ₹{ride.fare}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </DriverLayout>
  );
}

export default DriverEarnings;