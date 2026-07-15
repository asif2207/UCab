import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerDriver } from '../../services/driverService';
import { AuthContext } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';

function DriverRegister() {
  const [form, setForm] = useState({
    licenseNumber: '',
    vehicleType: 'sedan',
    vehicleNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await registerDriver(form);
      navigate('/driver/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <div style={{
        maxWidth: '450px',
        margin: '3rem auto',
        padding: '2rem',
      }}>
        <div style={{
          background: 'var(--surface)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '16px',
          padding: '2.5rem',
        }}>
          <h1 style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '1.6rem',
            marginBottom: '0.4rem',
          }}>
            Register as Driver
          </h1>
          <p style={{ color: 'var(--muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>
            Complete your driver profile to start accepting rides.
          </p>

          {error && (
            <p style={{
              background: 'rgba(255,80,80,0.1)',
              color: '#ff8080',
              padding: '0.7rem 1rem',
              borderRadius: '8px',
              marginBottom: '1rem',
              fontSize: '0.9rem',
            }}>
              {error}
            </p>
          )}

          <form
            onSubmit={handleSubmit}
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            <input
              type="text"
              name="licenseNumber"
              placeholder="License number"
              value={form.licenseNumber}
              onChange={handleChange}
              required
              style={{
                background: 'var(--bg)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'var(--text)',
                padding: '0.8rem 1rem',
                borderRadius: '8px',
                fontSize: '0.95rem',
                fontFamily: 'Inter, sans-serif',
              }}
            />

            <select
              name="vehicleType"
              value={form.vehicleType}
              onChange={handleChange}
              style={{
                background: 'var(--bg)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'var(--text)',
                padding: '0.8rem 1rem',
                borderRadius: '8px',
                fontSize: '0.95rem',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              <option value="mini">Mini</option>
              <option value="sedan">Sedan</option>
              <option value="suv">SUV</option>
            </select>

            <input
              type="text"
              name="vehicleNumber"
              placeholder="Vehicle number (e.g. AP09 AB 1234)"
              value={form.vehicleNumber}
              onChange={handleChange}
              required
              style={{
                background: 'var(--bg)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'var(--text)',
                padding: '0.8rem 1rem',
                borderRadius: '8px',
                fontSize: '0.95rem',
                fontFamily: 'Inter, sans-serif',
              }}
            />

            <button
              type="submit"
              disabled={loading}
              style={{
                background: 'var(--amber)',
                color: '#0E1116',
                border: 'none',
                padding: '0.85rem',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '1rem',
                fontFamily: 'Space Grotesk, sans-serif',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
                marginTop: '0.5rem',
              }}
            >
              {loading ? 'Registering...' : 'Register as Driver'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default DriverRegister;