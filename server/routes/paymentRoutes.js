const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
  createPayment,
  getPaymentByRide,
  getMyPayments,
} = require('../controllers/paymentController');

router.post('/', protect, createPayment);
router.get('/my', protect, getMyPayments);
router.get('/:rideId', protect, getPaymentByRide);

module.exports = router;