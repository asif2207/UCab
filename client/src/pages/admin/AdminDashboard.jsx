import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboardStats } from '../../services/adminService';
import { AuthContext } from '../../context/AuthContext';
import AdminLayout from '../../components/admin/AdminLayout';
import './AdminDashboard.css';

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }
    getDashboardStats()
      .then((res) => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-loading">Loading dashboard...</div>
      </AdminLayout>
    );
  }

  const STAT_CARDS = [
    { label: 'Total Riders', value: stats?.totalUsers || 0, icon: '👥', color: 'blue' },
    { label: 'Total Drivers', value: stats?.totalDrivers || 0, icon: '🚕', color: 'amber' },
    { label: 'Total Rides', value: stats?.totalRides || 0, icon: '📋', color: 'teal' },
    { label: 'Total Revenue', value: `₹${stats?.totalRevenue || 0}`, icon: '💰', color: 'purple' },
    { label: 'Completed', value: stats?.completedRides || 0, icon: '✅', color: 'green' },
    { label: 'Pending', value: stats?.pendingRides || 0, icon: '⏳', color: 'amber' },
    { label: 'Cancelled', value: stats?.cancelledRides || 0, icon: '❌', color: 'red' },
  ];

  return (
    <AdminLayout>
      <div className="admin-dashboard">
        <div className="admin-dashboard-header">
          <h1>Dashboard</h1>
          <p className="admin-dashboard-sub">
            Welcome back, {user?.name}. Here's what's happening.
          </p>
        </div>

        {/* Stats grid */}
        <div className="admin-stats-grid">
          {STAT_CARDS.map((card) => (
            <div key={card.label} className={`admin-stat-card ${card.color}`}>
              <div className="admin-stat-icon">{card.icon}</div>
              <div>
                <p className="admin-stat-value">{card.value}</p>
                <p className="admin-stat-label">{card.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="admin-quick-actions">
          <h2>Quick Actions</h2>
          <div className="quick-actions-grid">
            {[
              { label: 'Manage Users', path: '/admin/users', icon: '👥', desc: 'View and manage all riders' },
              { label: 'Manage Drivers', path: '/admin/drivers', icon: '🚕', desc: 'Verify and manage drivers' },
              { label: 'All Bookings', path: '/admin/bookings', icon: '📋', desc: 'Monitor all ride bookings' },
              { label: 'Payments', path: '/admin/payments', icon: '💰', desc: 'Track all transactions' },
            ].map((action) => (
              <div
                key={action.label}
                className="quick-action-card"
                onClick={() => navigate(action.path)}
              >
                <span className="qa-icon">{action.icon}</span>
                <div>
                  <p className="qa-label">{action.label}</p>
                  <p className="qa-desc">{action.desc}</p>
                </div>
                <span className="qa-arrow">›</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;