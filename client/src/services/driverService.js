import api from './api';

export const registerDriver = (data) => api.post('/drivers/register', data);
export const getDriverProfile = () => api.get('/drivers/profile');
export const getPendingRides = () => api.get('/drivers/rides/pending');
export const getDriverRides = () => api.get('/drivers/rides/history');
export const acceptRide = (id) => api.put(`/drivers/rides/${id}/accept`);
export const rejectRide = (id) => api.put(`/drivers/rides/${id}/reject`);
export const updateRideStatus = (id, status) =>
  api.put(`/drivers/rides/${id}/status`, { status });
export const toggleAvailability = () => api.put('/drivers/availability');