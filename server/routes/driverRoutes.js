const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
  registerDriver,
  getDriverProfile,
  getPendingRides,
  acceptRide,
  rejectRide,
  updateRideStatus,
  getDriverRides,
  toggleAvailability,
} = require('../controllers/driverController');

router.post('/register', protect, registerDriver);
router.get('/profile', protect, getDriverProfile);
router.get('/rides/pending', protect, getPendingRides);
router.get('/rides/history', protect, getDriverRides);
router.put('/rides/:id/accept', protect, acceptRide);
router.put('/rides/:id/reject', protect, rejectRide);
router.put('/rides/:id/status', protect, updateRideStatus);
router.put('/availability', protect, toggleAvailability);

module.exports = router;