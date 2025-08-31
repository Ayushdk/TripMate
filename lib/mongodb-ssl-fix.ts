import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// SSL-fixed connection method
export async function connectDBSSLFixed() {
  try {
    console.log('Attempting SSL-fixed MongoDB connection...');
    
    // Clean the URI
    const cleanUri = MONGODB_URI
      .replace(/[?&]retryWrites=[^&]*/g, '')
      .replace(/[?&]w=[^&]*/g, '')
      .replace(/[?&]appName=[^&]*/g, '')
      .replace(/[?&]$/, '');
    
    // Try different SSL configurations
    const sslConfigs = [
      // Config 1: No SSL options
      {},
      // Config 2: Explicit SSL disabled
      { ssl: false, sslValidate: false },
      // Config 3: Force TLS 1.2
      { ssl: true, sslValidate: false, tls: true },
      // Config 4: Allow invalid certificates
      { ssl: true, sslValidate: false, tlsAllowInvalidCertificates: true }
    ];
    
    for (let i = 0; i < sslConfigs.length; i++) {
      try {
        console.log(`Trying SSL config ${i + 1}...`);
        
        const opts = {
          bufferCommands: false,
          maxPoolSize: 1,
          serverSelectionTimeoutMS: 15000,
          socketTimeoutMS: 20000,
          ...sslConfigs[i]
        };
        
        const connection = await mongoose.connect(cleanUri, opts);
        
        if (connection.connection.readyState === 1) {
          console.log(`SSL config ${i + 1} successful!`);
          return connection;
        }
        
        await mongoose.disconnect();
      } catch (error: any) {
        console.log(`SSL config ${i + 1} failed:`, error.message);
        continue;
      }
    }
    
    throw new Error('All SSL configurations failed');
    
  } catch (error: any) {
    console.error('SSL-fixed MongoDB connection failed:', error.message);
    throw error;
  }
}

// Test the SSL-fixed connection
export async function testSSLConnection() {
  try {
    const connection = await connectDBSSLFixed();
    const isConnected = connection.connection.readyState === 1;
    
    if (isConnected) {
      console.log('SSL connection test successful');
      await mongoose.disconnect();
      return true;
    } else {
      console.log('SSL connection not ready');
      return false;
    }
  } catch (error) {
    console.error('SSL connection test failed:', error);
    return false;
  }
}

