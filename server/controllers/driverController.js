const Driver = require('../models/Driver');
const Ride = require('../models/Ride');
const User = require('../models/User');

// Register as driver
exports.registerDriver = async (req, res) => {
  try {
    const { licenseNumber, vehicleType, vehicleNumber } = req.body;

    const existing = await Driver.findOne({ user: req.user._id });
    if (existing) {
      return res.status(400).json({ message: 'Already registered as driver' });
    }

    const driver = await Driver.create({
      user: req.user._id,
      licenseNumber,
      vehicleType,
      vehicleNumber,
    });

    // Update user role to driver
    await User.findByIdAndUpdate(req.user._id, { role: 'driver' });

    res.status(201).json(driver);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get driver profile
exports.getDriverProfile = async (req, res) => {
  try {
    const driver = await Driver.findOne({ user: req.user._id }).populate(
      'user',
      'name email phone'
    );
    if (!driver) {
      return res.status(404).json({ message: 'Driver profile not found' });
    }
    res.json(driver);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get pending rides (available for driver to accept)
exports.getPendingRides = async (req, res) => {
  try {
    const rides = await Ride.find({ status: 'pending' })
      .populate('rider', 'name phone')
      .sort({ createdAt: -1 });
    res.json(rides);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Accept a ride
exports.acceptRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }
    if (ride.status !== 'pending') {
      return res.status(400).json({ message: 'Ride is no longer available' });
    }

    ride.status = 'accepted';
    ride.driver = req.user._id;
    await ride.save();

    res.json(ride);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Reject a ride
exports.rejectRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }
    ride.status = 'cancelled';
    await ride.save();
    res.json(ride);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update ride status
exports.updateRideStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const ride = await Ride.findById(req.params.id);
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    ride.status = status;
    await ride.save();

    // Update driver earnings on completion
    if (status === 'completed') {
      await Driver.findOneAndUpdate(
        { user: req.user._id },
        {
          $inc: {
            totalEarnings: ride.fare,
            totalRides: 1,
          },
        }
      );
    }

    res.json(ride);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get driver's ride history
exports.getDriverRides = async (req, res) => {
  try {
    const rides = await Ride.find({ driver: req.user._id })
      .populate('rider', 'name phone')
      .sort({ createdAt: -1 });
    res.json(rides);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Toggle availability
exports.toggleAvailability = async (req, res) => {
  try {
    const driver = await Driver.findOne({ user: req.user._id });
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }
    driver.isAvailable = !driver.isAvailable;
    await driver.save();
    res.json({ isAvailable: driver.isAvailable });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};