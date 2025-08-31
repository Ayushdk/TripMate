import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  destination: { type: String, required: true },
  currentLocation: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  travelers: { type: Number, required: true },
  budget: { type: Number, required: true },
  dailyBudget: { type: Number, required: true },
  budgetRange: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['draft', 'planning', 'confirmed', 'completed'], 
    default: 'draft' 
  },
  interests: [String],
  additionalNotes: String,
  image: String,
  activities: [{
    name: String,
    date: Date,
    location: String,
    description: String
  }],
  createdAt: { type: Date, default: Date.now }
});

// Check if the model already exists before creating a new one
export const Trip = mongoose.models.Trip || mongoose.model('Trip', tripSchema);
