import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Trip } from '@/models/Trip';
import { auth } from '@/lib/auth';

// GET all trips for a user
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const trips = await Trip.find({ userId: session.user.id }).sort({ createdAt: -1 });
    return NextResponse.json(trips);
  } catch (error: any) {
    console.error('Error fetching trips:', error);
    
    // Handle specific MongoDB connection errors
    if (error.name === 'MongoServerSelectionError' || error.code === 'ENOTFOUND') {
      return NextResponse.json({ 
        error: 'Database connection failed. Please try again later.',
        details: 'Unable to connect to the database server.'
      }, { status: 503 });
    }
    
    if (error.name === 'MongoNetworkError') {
      return NextResponse.json({ 
        error: 'Network error. Please check your connection and try again.',
        details: 'Failed to establish connection with the database.'
      }, { status: 503 });
    }
    
    return NextResponse.json({ 
      error: 'Failed to fetch trips',
      details: 'An unexpected error occurred while accessing the database.'
    }, { status: 500 });
  }
}

// POST create new trip
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();
    const trip = new Trip({
      ...body,
      userId: session.user.id
    });

    const savedTrip = await trip.save();
    return NextResponse.json(savedTrip, { status: 201 });
  } catch (error: any) {
    console.error('Error creating trip:', error);
    
    // Handle specific MongoDB connection errors
    if (error.name === 'MongoServerSelectionError' || error.code === 'ENOTFOUND') {
      return NextResponse.json({ 
        error: 'Database connection failed. Please try again later.',
        details: 'Unable to connect to the database server.'
      }, { status: 503 });
    }
    
    if (error.name === 'MongoNetworkError') {
      return NextResponse.json({ 
        error: 'Network error. Please check your connection and try again.',
        details: 'Failed to establish connection with the database.'
      }, { status: 503 });
    }
    
    return NextResponse.json({ 
      error: 'Failed to create trip',
      details: 'An unexpected error occurred while saving to the database.'
    }, { status: 500 });
  }
}
