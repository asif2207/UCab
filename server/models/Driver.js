const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    licenseNumber: { type: String, required: true },
    vehicleType: {
      type: String,
      enum: ['mini', 'sedan', 'suv'],
      default: 'sedan',
    },
    vehicleNumber: { type: String, required: true },
    isAvailable: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    currentLocation: {
      lat: { type: Number, default: 0 },
      lng: { type: Number, default: 0 },
    },
    totalEarnings: { type: Number, default: 0 },
    totalRides: { type: Number, default: 0 },
    rating: { type: Number, default: 5.0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Driver', driverSchema);