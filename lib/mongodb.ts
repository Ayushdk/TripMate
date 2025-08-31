import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

declare global {
  var mongoose: {
    conn: any;
    promise: any;
  } | undefined;
}

let cached: {
  conn: any;
  promise: any;
} = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    try {
      console.log('Attempting MongoDB connection...');
      
      // Clean the URI by removing problematic parameters
      let cleanUri = MONGODB_URI;
      
      // Remove problematic query parameters
      cleanUri = cleanUri.replace(/[?&]retryWrites=[^&]*/g, '');
      cleanUri = cleanUri.replace(/[?&]w=[^&]*/g, '');
      cleanUri = cleanUri.replace(/[?&]appName=[^&]*/g, '');
      cleanUri = cleanUri.replace(/[?&]$/, '');
      
      console.log('Using cleaned URI for connection');
      
      // Use absolutely minimal connection options
      const opts = {
        bufferCommands: false,
      };
      
      cached.promise = mongoose.connect(cleanUri, opts);
    } catch (error: any) {
      console.error('MongoDB connection error:', error.message);
      throw error;
    }
  }
  
  try {
    cached.conn = await cached.promise;
    console.log('MongoDB connected successfully');
    
    // Handle connection events
    mongoose.connection.on('error', (error) => {
      console.error('MongoDB connection error:', error);
      cached.conn = null;
      cached.promise = null;
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
      cached.conn = null;
      cached.promise = null;
    });
    
    return cached.conn;
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    cached.promise = null;
    throw error;
  }
}

export default connectDB;
