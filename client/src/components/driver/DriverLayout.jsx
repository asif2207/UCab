import React, { useState, useEffect } from 'react';
import DriverNavbar from './DriverNavbar';
import DriverSidebar from './DriverSidebar';
import { getDriverProfile, toggleAvailability } from '../../services/driverService';
import './DriverLayout.css';

function DriverLayout({ children }) {
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    getDriverProfile()
      .then((res) => setIsAvailable(res.data.isAvailable))
      .catch(() => {});
  }, []);

  const handleToggle = async () => {
    try {
      const res = await toggleAvailability();
      setIsAvailable(res.data.isAvailable);
    } catch (err) {}
  };

  return (
    <div className="driver-layout">
      <DriverNavbar isAvailable={isAvailable} onToggle={handleToggle} />
      <div className="driver-layout-body">
        <DriverSidebar />
        <main className="driver-main">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DriverLayout;