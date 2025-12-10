import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: true 
  },
  name: { 
    type: String, 
    required: true,
    trim: true
  },
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
