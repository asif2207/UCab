import api from './api';

export const createPayment = (data) => api.post('/payments', data);
export const getPaymentByRide = (rideId) => api.get(`/payments/${rideId}`);
export const getMyPayments = () => api.get('/payments/my');