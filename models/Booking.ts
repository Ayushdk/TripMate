import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: true
  },
  type: {
    type: String,
    enum: ['flight', 'hotel', 'car', 'activity', 'restaurant'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  details: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['confirmed', 'pending', 'cancelled', 'completed'],
    default: 'pending'
  },
  price: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'USD'
  },
  confirmationNumber: {
    type: String
  },
  provider: {
    type: String
  },
  location: {
    type: String
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Create indexes for better query performance
bookingSchema.index({ userId: 1, tripId: 1 });
bookingSchema.index({ userId: 1, status: 1 });
bookingSchema.index({ userId: 1, type: 1 });

export const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);

