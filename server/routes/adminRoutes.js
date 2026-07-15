const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/adminMiddleware');
const {
  getDashboardStats,
  getAllUsers,
  getAllDrivers,
  getAllBookings,
  getAllPayments,
  deleteUser,
  verifyDriver,
  cancelBooking,
} = require('../controllers/adminController');

router.use(protect, adminOnly);

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.get('/drivers', getAllDrivers);
router.get('/bookings', getAllBookings);
router.get('/payments', getAllPayments);
router.delete('/users/:id', deleteUser);
router.put('/drivers/:id/verify', verifyDriver);
router.put('/bookings/:id/cancel', cancelBooking);

module.exports = router;