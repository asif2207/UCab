import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllUsers, deleteUser } from '../../services/adminService';
import { AuthContext } from '../../context/AuthContext';
import AdminLayout from '../../components/admin/AdminLayout';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') { navigate('/login'); return; }
    fetchUsers();
  }, [user]);

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();
      setUsers(res.data);
    } catch (err) {} finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await deleteUser(id);
      fetchUsers();
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div style={{ maxWidth: '900px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontFamily: 'Space Grotesk,sans-serif', fontSize: '1.8rem' }}>Users</h1>
          <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{users.length} total riders</span>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search by name or email..."
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
            width: '100%',
          }}
        />

        {/* Table */}
        <div style={{
          background: '#161b22',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '14px',
          overflow: 'hidden',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                {['Name', 'Email', 'Phone', 'Joined', 'Actions'].map((h) => (
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
                  <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted)' }}>
                    Loading...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted)' }}>
                    No users found
                  </td>
                </tr>
              ) : filtered.map((u, i) => (
                <tr
                  key={u._id}
                  style={{
                    borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                  }}
                >
                  <td style={{ padding: '0.9rem 1.2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: 'rgba(96,165,250,0.15)',
                        border: '1px solid rgba(96,165,250,0.3)',
                        color: '#60a5fa',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '700',
                        fontSize: '0.85rem',
                        flexShrink: 0,
                      }}>
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{u.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '0.9rem 1.2rem', color: 'var(--muted)', fontSize: '0.85rem' }}>{u.email}</td>
                  <td style={{ padding: '0.9rem 1.2rem', color: 'var(--muted)', fontSize: '0.85rem' }}>{u.phone}</td>
                  <td style={{ padding: '0.9rem 1.2rem', color: 'var(--muted)', fontSize: '0.85rem' }}>
                    {new Date(u.createdAt).toLocaleDateString('en-IN')}
                  </td>
                  <td style={{ padding: '0.9rem 1.2rem' }}>
                    <button
                      onClick={() => handleDelete(u._id)}
                      style={{
                        background: 'rgba(239,68,68,0.1)',
                        border: '1px solid rgba(239,68,68,0.3)',
                        color: '#ef4444',
                        padding: '0.3rem 0.8rem',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        fontFamily: 'Inter,sans-serif',
                      }}
                    >
                      Delete
                    </button>
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

export default AdminUsers;