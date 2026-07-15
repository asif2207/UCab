const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
  createBooking,
  getMyRides,
  getRideById,
  cancelRide,
} = require('../controllers/bookingController');

router.post('/', protect, createBooking);
router.get('/my', protect, getMyRides);
router.get('/:id', protect, getRideById);
router.put('/:id/cancel', protect, cancelRide);

module.exports = router;