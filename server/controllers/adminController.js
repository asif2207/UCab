const User = require('../models/User');
const Driver = require('../models/Driver');
const Ride = require('../models/Ride');
const Payment = require('../models/Payment');

// Dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalDrivers,
      totalRides,
      completedRides,
      cancelledRides,
      pendingRides,
      payments,
    ] = await Promise.all([
      User.countDocuments({ role: 'rider' }),
      User.countDocuments({ role: 'driver' }),
      Ride.countDocuments(),
      Ride.countDocuments({ status: 'completed' }),
      Ride.countDocuments({ status: 'cancelled' }),
      Ride.countDocuments({ status: 'pending' }),
      Payment.find({ status: 'completed' }),
    ]);

    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

    res.json({
      totalUsers,
      totalDrivers,
      totalRides,
      completedRides,
      cancelledRides,
      pendingRides,
      totalRevenue,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'rider' })
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all drivers
exports.getAllDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find()
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const rides = await Ride.find()
      .populate('rider', 'name phone')
      .populate('driver', 'name phone')
      .sort({ createdAt: -1 });
    res.json(rides);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all payments
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('rider', 'name email')
      .populate('ride')
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Verify driver
exports.verifyDriver = async (req, res) => {
  try {
    const driver = await Driver.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true }
    );
    res.json(driver);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Cancel any booking
exports.cancelBooking = async (req, res) => {
  try {
    const ride = await Ride.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled' },
      { new: true }
    );
    res.json(ride);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};