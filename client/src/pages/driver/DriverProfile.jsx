import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDriverProfile } from '../../services/driverService';
import { AuthContext } from '../../context/AuthContext';
import DriverLayout from '../../components/driver/DriverLayout';

const CAB_ICONS = { mini: '🚗', sedan: '🚕', suv: '🚙' };

function DriverProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    getDriverProfile()
      .then((res) => setProfile(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const initial = user?.name?.charAt(0).toUpperCase() || '?';

  return (
    <DriverLayout>
      <div style={{ maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <h1 style={{ fontFamily: 'Space Grotesk,sans-serif', fontSize: '1.8rem' }}>Profile</h1>

        {/* Avatar + name */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '16px',
          padding: '2rem',
          textAlign: 'center',
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'var(--amber)',
            color: '#0E1116',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '700',
            fontSize: '2rem',
            margin: '0 auto 1rem',
          }}>
            {initial}
          </div>
          <h2 style={{ fontFamily: 'Space Grotesk,sans-serif', fontSize: '1.4rem', marginBottom: '0.3rem' }}>
            {user?.name}
          </h2>
          <p style={{ color: 'var(--teal)', fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Driver
          </p>
        </div>

        {/* User details */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '14px',
          padding: '1.2rem 1.5rem',
        }}>
          <h3 style={{ fontFamily: 'Space Grotesk,sans-serif', fontSize: '0.9rem', color: 'var(--muted)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Personal Info
          </h3>
          {[
            { label: 'Email', value: user?.email },
            { label: 'Phone', value: user?.phone },
          ].map((item) => (
            <div key={item.label} style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '0.7rem 0',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              fontSize: '0.9rem',
            }}>
              <span style={{ color: 'var(--muted)' }}>{item.label}</span>
              <span style={{ color: 'var(--text)' }}>{item.value}</span>
            </div>
          ))}
        </div>

        {/* Vehicle details */}
        {profile && (
          <div style={{
            background: 'var(--surface)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '14px',
            padding: '1.2rem 1.5rem',
          }}>
            <h3 style={{ fontFamily: 'Space Grotesk,sans-serif', fontSize: '0.9rem', color: 'var(--muted)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Vehicle Info
            </h3>
            {[
              { label: 'Vehicle Type', value: `${CAB_ICONS[profile.vehicleType]} ${profile.vehicleType?.charAt(0).toUpperCase() + profile.vehicleType?.slice(1)}` },
              { label: 'Vehicle Number', value: profile.vehicleNumber },
              { label: 'License Number', value: profile.licenseNumber },
              { label: 'Status', value: profile.isVerified ? '✅ Verified' : '⏳ Pending' },
              { label: 'Rating', value: `⭐ ${profile.rating}` },
            ].map((item) => (
              <div key={item.label} style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0.7rem 0',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                fontSize: '0.9rem',
              }}>
                <span style={{ color: 'var(--muted)' }}>{item.label}</span>
                <span style={{ color: 'var(--text)' }}>{item.value}</span>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={handleLogout}
          style={{
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.3)',
            color: '#ef4444',
            padding: '0.85rem',
            borderRadius: '10px',
            fontSize: '0.95rem',
            fontWeight: '600',
            cursor: 'pointer',
            fontFamily: 'Inter,sans-serif',
          }}
        >
          Log out
        </button>
      </div>
    </DriverLayout>
  );
}

export default DriverProfile;