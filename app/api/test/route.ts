import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({ 
      message: 'MongoDB connection successful!',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return NextResponse.json({ 
      error: 'MongoDB connection failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
