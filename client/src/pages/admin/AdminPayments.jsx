import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllPayments } from '../../services/adminService';
import { AuthContext } from '../../context/AuthContext';
import AdminLayout from '../../components/admin/AdminLayout';

function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') { navigate('/login'); return; }
    getAllPayments()
      .then((res) => setPayments(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

  const filtered = payments.filter(
    (p) =>
      p.rider?.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.transactionId?.toLowerCase().includes(search.toLowerCase())
  );

  const METHOD_ICONS = { cash: '💵', upi: '📱', card: '💳', wallet: '👛' };

  return (
    <AdminLayout>
      <div style={{ maxWidth: '900px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontFamily: 'Space Grotesk,sans-serif', fontSize: '1.8rem' }}>Payments</h1>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontFamily: 'Space Grotesk,sans-serif', fontSize: '1.4rem', fontWeight: '700', color: 'var(--amber)' }}>
              ₹{totalRevenue}
            </p>
            <p style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>Total Revenue</p>
          </div>
        </div>

        <input
          type="text"
          placeholder="Search by rider or transaction ID..."
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

        <div style={{
          background: '#161b22',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '14px',
          overflow: 'hidden',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                {['Transaction', 'Rider', 'Amount', 'Method', 'Status', 'Date'].map((h) => (
                  <th key={h} style={{
                    padding: '0.9rem 1.2rem',
                    textAlign: 'left',
                    color: 'var(--muted)',
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    fontWeight: '600',
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted)' }}>
                    Loading...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted)' }}>
                    No payments found
                  </td>
                </tr>
              ) : filtered.map((payment, i) => (
                <tr
                  key={payment._id}
                  style={{
                    borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                  }}
                >
                  <td style={{ padding: '0.9rem 1.2rem', fontSize: '0.78rem', color: 'var(--muted)', fontFamily: 'monospace' }}>
                    {payment.transactionId || '—'}
                  </td>
                  <td style={{ padding: '0.9rem 1.2rem', fontSize: '0.85rem' }}>
                    {payment.rider?.name}
                  </td>
                  <td style={{ padding: '0.9rem 1.2rem', fontWeight: '700', color: 'var(--amber)', fontFamily: 'Space Grotesk,sans-serif' }}>
                    ₹{payment.amount}
                  </td>
                  <td style={{ padding: '0.9rem 1.2rem', fontSize: '0.85rem' }}>
                    {METHOD_ICONS[payment.method]} {payment.method?.toUpperCase()}
                  </td>
                  <td style={{ padding: '0.9rem 1.2rem' }}>
                    <span style={{
                      background: payment.status === 'completed' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                      border: `1px solid ${payment.status === 'completed' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
                      color: payment.status === 'completed' ? '#22c55e' : '#ef4444',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                    }}>
                      {payment.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.9rem 1.2rem', color: 'var(--muted)', fontSize: '0.82rem' }}>
                    {new Date(payment.createdAt).toLocaleDateString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminPayments;
