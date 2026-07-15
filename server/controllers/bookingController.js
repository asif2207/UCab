const Ride = require('../models/Ride');
const calculateFare = require('../services/fareCalculation');

exports.createBooking = async (req, res) => {
  try {
    const { pickupLocation, dropLocation, cabType, distance } = req.body;

    if (!pickupLocation || !dropLocation || !cabType) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }

    const distanceKm = distance || 5;
    const fare = calculateFare(cabType, distanceKm);

    const ride = await Ride.create({
      rider: req.user._id,
      pickupLocation,
      dropLocation,
      cabType,
      fare,
      distance: distanceKm,
      status: 'pending',
    });

    res.status(201).json(ride);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyRides = async (req, res) => {
  try {
    const rides = await Ride.find({ rider: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(rides);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getRideById = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }
    res.json(ride);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.cancelRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }
    if (ride.rider.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    ride.status = 'cancelled';
    await ride.save();
    res.json(ride);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};