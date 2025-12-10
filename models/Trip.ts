// import mongoose from 'mongoose';

// const tripSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   destination: { type: String, required: true },
//   currentLocation: { type: String, required: true },
//   startDate: { type: Date, required: true },
//   endDate: { type: Date, required: true },
//   travelers: { type: Number, required: true },
//   budget: { type: Number, required: true },
//   dailyBudget: { type: Number, required: true },
//   budgetRange: { type: String, required: true },
//   status: { 
//     type: String, 
//     enum: ['draft', 'planning', 'confirmed', 'completed'], 
//     default: 'draft' 
//   },
//   interests: [String],
//   additionalNotes: String,
//   image: String,
//   activities: [{
//     name: String,
//     date: Date,
//     location: String,
//     description: String
//   }],
//   itinerary: {
//     days: [{
//       day: Number,
//       date: Date,
//       activities: [{
//         time: String,
//         type: String, // transportation, activity, meal, accommodation
//         title: String,
//         location: String,
//         description: String,
//         estimatedCost: String,
//         duration: String
//       }]
//     }],
//     transportation: {
//       toDestination: {
//         type: String,
//         departureTime: String,
//         arrivalTime: String,
//         estimatedCost: String
//       },
//       fromDestination: {
//         type: String,
//         departureTime: String,
//         arrivalTime: String,
//         estimatedCost: String
//       }
//     },
//     totalEstimatedCost: String
//   },
//   createdAt: { type: Date, default: Date.now }
// });

// // Check if the model already exists before creating a new one
// export const Trip = mongoose.models.Trip || mongoose.model('Trip', tripSchema);



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

  // 🔴 Yaha pehle tumhara nested "days / transportation / totalEstimatedCost" wala structure tha
  // usko hata ke ye flexible Mixed type rakhna hai:

  itinerary: {
    type: mongoose.Schema.Types.Mixed,     // { itinerary: [...], totalEstimatedCost, transportation }
    default: null,
  },

  createdAt: { type: Date, default: Date.now }
});

// Check if the model already exists before creating a new one
export const Trip = mongoose.models.Trip || mongoose.model('Trip', tripSchema);
