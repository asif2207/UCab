import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllDrivers, verifyDriver } from '../../services/adminService';
import { AuthContext } from '../../context/AuthContext';
import AdminLayout from '../../components/admin/AdminLayout';

const CAB_ICONS = { mini: '🚗', sedan: '🚕', suv: '🚙' };

function AdminDrivers() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') { navigate('/login'); return; }
    fetchDrivers();
  }, [user]);

  const fetchDrivers = async () => {
    try {
      const res = await getAllDrivers();
      setDrivers(res.data);
    } catch (err) {} finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id) => {
    try {
      await verifyDriver(id);
      fetchDrivers();
    } catch (err) {
      alert('Failed to verify driver');
    }
  };

  const filtered = drivers.filter(
    (d) =>
      d.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      d.vehicleNumber?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div style={{ maxWidth: '1000px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontFamily: 'Space Grotesk,sans-serif', fontSize: '1.8rem' }}>Drivers</h1>
          <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{drivers.length} total drivers</span>
        </div>

        <input
          type="text"
          placeholder="Search by name or vehicle number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            background: '#161b22',
            border: '1px solid rgba(255,255,255,0.08)',
            color: 'var(--text)',
            padding: '0.8rem 1rem',
            borderRadius: '10px',
            fontSize: '0.9rem',
            fontFamily: 'Inter,sans-serif',
          }}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          {loading ? (
            <p style={{ color: 'var(--muted)', padding: '2rem', textAlign: 'center' }}>Loading...</p>
          ) : filtered.length === 0 ? (
            <p style={{ color: 'var(--muted)', padding: '2rem', textAlign: 'center' }}>No drivers found</p>
          ) : filtered.map((driver) => (
            <div key={driver._id} style={{
              background: '#161b22',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '14px',
              padding: '1.2rem 1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '2rem' }}>{CAB_ICONS[driver.vehicleType]}</span>
                <div>
                  <p style={{ fontWeight: '600', fontSize: '0.95rem', marginBottom: '0.2rem' }}>
                    {driver.user?.name}
                  </p>
                  <p style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>
                    {driver.user?.email} · {driver.user?.phone}
                  </p>
                  <p style={{ color: 'var(--muted)', fontSize: '0.8rem', marginTop: '0.2rem' }}>
                    {driver.vehicleNumber} · License: {driver.licenseNumber}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
                    ⭐ {driver.rating} · {driver.totalRides} rides
                  </p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--amber)', fontWeight: '600' }}>
                    ₹{driver.totalEarnings} earned
                  </p>
                </div>

                {driver.isVerified ? (
                  <span style={{
                    background: 'rgba(34,197,94,0.1)',
                    border: '1px solid rgba(34,197,94,0.3)',
                    color: '#22c55e',
                    padding: '0.3rem 0.8rem',
                    borderRadius: '20px',
                    fontSize: '0.78rem',
                    fontWeight: '600',
                  }}>
                    ✅ Verified
                  </span>
                ) : (
                  <button
                    onClick={() => handleVerify(driver._id)}
                    style={{
                      background: 'rgba(167,139,250,0.1)',
                      border: '1px solid rgba(167,139,250,0.3)',
                      color: '#a78bfa',
                      padding: '0.4rem 1rem',
                      borderRadius: '8px',
                      fontSize: '0.82rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontFamily: 'Inter,sans-serif',
                    }}
                  >
                    Verify Driver
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

export default AdminDrivers;