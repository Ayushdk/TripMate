import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// Alternative connection method that might work better with SSL issues
export async function connectDBFallback() {
  try {
    console.log('Attempting fallback MongoDB connection...');
    
    // Parse the URI to extract components
    const uri = new URL(MONGODB_URI);
    const username = uri.username;
    const password = uri.password;
    const hostname = uri.hostname;
    const pathname = uri.pathname;
    
    // Build a clean connection string without problematic parameters
    const cleanUri = `mongodb+srv://${username}:${password}@${hostname}${pathname}`;
    
    console.log('Using clean connection string');
    
    // Connect with minimal options
    const connection = await mongoose.connect(cleanUri, {
      bufferCommands: false,
      maxPoolSize: 1,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 20000,
    });
    
    console.log('Fallback MongoDB connection successful');
    return connection;
    
  } catch (error: any) {
    console.error('Fallback MongoDB connection failed:', error.message);
    throw error;
  }
}

// Simple connection test
export async function testConnection() {
  try {
    const connection = await connectDBFallback();
    const isConnected = connection.connection.readyState === 1;
    
    if (isConnected) {
      console.log('Connection test successful');
      await mongoose.disconnect();
      return true;
    } else {
      console.log('Connection not ready');
      return false;
    }
  } catch (error) {
    console.error('Connection test failed:', error);
    return false;
  }
}

