import api from './api';

export const getDashboardStats = () => api.get('/admin/stats');
export const getAllUsers = () => api.get('/admin/users');
export const getAllDrivers = () => api.get('/admin/drivers');
export const getAllBookings = () => api.get('/admin/bookings');
export const getAllPayments = () => api.get('/admin/payments');
export const deleteUser = (id) => api.delete(`/admin/users/${id}`);
export const verifyDriver = (id) => api.put(`/admin/drivers/${id}/verify`);
export const cancelBooking = (id) => api.put(`/admin/bookings/${id}/cancel`);