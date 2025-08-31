import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function GET() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      return NextResponse.json({
        status: 'error',
        message: 'MONGODB_URI not found'
      }, { status: 500 });
    }

    // Try a simple connection without any options
    console.log('Testing simple MongoDB connection...');
    
    const connection = await mongoose.connect(mongoUri);
    
    if (connection.connection.readyState === 1) {
      await mongoose.disconnect();
      return NextResponse.json({
        status: 'success',
        message: 'Simple connection successful',
        readyState: connection.connection.readyState
      });
    } else {
      return NextResponse.json({
        status: 'error',
        message: 'Connection not ready',
        readyState: connection.connection.readyState
      }, { status: 500 });
    }
    
  } catch (error: any) {
    console.error('Simple connection test failed:', error);
    
    return NextResponse.json({
      status: 'error',
      message: 'Simple connection failed',
      error: error.message,
      errorName: error.name,
      errorCode: error.code
    }, { status: 500 });
  }
}

