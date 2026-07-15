const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema(
  {
    rider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    pickupLocation: { type: String, required: true },
    dropLocation: { type: String, required: true },
    cabType: {
      type: String,
      enum: ['mini', 'sedan', 'suv'],
      required: true,
    },
    fare: { type: Number, required: true },
    distance: { type: Number },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'ongoing', 'completed', 'cancelled'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid'],
      default: 'unpaid',
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'online'],
      default: 'cash',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Ride', rideSchema);