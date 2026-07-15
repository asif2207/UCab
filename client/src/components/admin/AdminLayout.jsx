import React from 'react';
import AdminNavbar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';
import './AdminLayout.css';

function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
      <AdminNavbar />
      <div className="admin-layout-body">
        <AdminSidebar />
        <main className="admin-main">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;