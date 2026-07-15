import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Booking from '../pages/Booking';
import LiveTracking from '../pages/LiveTracking';
import Payment from '../pages/Payment';
import BookingHistory from '../pages/BookingHistory';
import Profile from '../pages/Profile';
import DriverDashboard from '../pages/driver/DriverDashboard';
import DriverRides from '../pages/driver/DriverRides';
import DriverEarnings from '../pages/driver/DriverEarnings';
import DriverRegister from '../pages/driver/DriverRegister';
import DriverProfile from '../pages/driver/DriverProfile';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminDrivers from '../pages/admin/AdminDrivers';
import AdminBookings from '../pages/admin/AdminBookings';
import AdminPayments from '../pages/admin/AdminPayments';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/booking" element={<Booking />} />
      <Route path="/tracking" element={<LiveTracking />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/history" element={<BookingHistory />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/driver/register" element={<DriverRegister />} />
      <Route path="/driver/dashboard" element={<DriverDashboard />} />
      <Route path="/driver/rides" element={<DriverRides />} />
      <Route path="/driver/earnings" element={<DriverEarnings />} />
      <Route path="/driver/profile" element={<DriverProfile />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/users" element={<AdminUsers />} />
      <Route path="/admin/drivers" element={<AdminDrivers />} />
      <Route path="/admin/bookings" element={<AdminBookings />} />
      <Route path="/admin/payments" element={<AdminPayments />} />
    </Routes>
  );
}

export default AppRoutes;