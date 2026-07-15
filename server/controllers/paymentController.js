const Payment = require('../models/Payment');
const Ride = require('../models/Ride');

exports.createPayment = async (req, res) => {
  try {
    const { rideId, method } = req.body;

    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    if (ride.paymentStatus === 'paid') {
      return res.status(400).json({ message: 'Ride already paid' });
    }

    const payment = await Payment.create({
      ride: rideId,
      rider: req.user._id,
      amount: ride.fare,
      method,
      status: 'completed',
      transactionId: `TXN${Date.now()}`,
    });

    ride.paymentStatus = 'paid';
    ride.paymentMethod = method;
    ride.status = 'completed';
    await ride.save();

    res.status(201).json(payment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPaymentByRide = async (req, res) => {
  try {
    const payment = await Payment.findOne({ ride: req.params.rideId });
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.json(payment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ rider: req.user._id })
      .populate('ride')
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};