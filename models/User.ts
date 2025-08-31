import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false }, // Optional for OAuth users
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  profile: {
    avatar: String,
    phone: String,
    bio: String,
    location: String,
    interests: [String],
    preferences: [String]
  }
});

// Check if the model already exists before creating a new one
export const User = mongoose.models.User || mongoose.model('User', userSchema);
