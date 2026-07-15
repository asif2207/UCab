import api from './api';

export const createBooking = (data) => api.post('/bookings', data);
export const getMyRides = () => api.get('/bookings/my');
export const getRideById = (id) => api.get(`/bookings/${id}`);
export const cancelRide = (id) => api.put(`/bookings/${id}/cancel`);