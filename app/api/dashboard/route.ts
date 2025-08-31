import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import { Trip } from '@/models/Trip';
import { User } from '@/models/User';

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Get user's trips
    const trips = await Trip.find({ userId: session.user.id });
    
    // Calculate statistics
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const totalTrips = trips.length;
    const thisMonthTrips = trips.filter(trip => 
      new Date(trip.startDate) >= startOfMonth
    ).length;
    
    const upcomingTrips = trips.filter(trip => 
      new Date(trip.startDate) > now && trip.status !== 'completed'
    ).length;
    
    const completedTrips = trips.filter(trip => 
      trip.status === 'completed'
    ).length;
    
    // Get unique countries visited
    const countries = new Set();
    trips.forEach(trip => {
      if (trip.destination) {
        // Extract country from destination (assuming format like "Paris, France")
        const parts = trip.destination.split(',');
        if (parts.length > 1) {
          countries.add(parts[parts.length - 1].trim());
        } else {
          countries.add(trip.destination.trim());
        }
      }
    });
    
    const savedCountries = countries.size;
    
    // Calculate total saved based on trip budgets
    const totalSaved = trips.reduce((sum, trip) => sum + (trip.budget || 0), 0);
    
    return NextResponse.json({
      totalTrips,
      thisMonthTrips,
      upcomingTrips,
      completedTrips,
      savedCountries,
      totalSaved
    });
    
  } catch (error: any) {
    console.error('Dashboard API error:', error);
    
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
      error: 'Internal server error',
      details: 'An unexpected error occurred while accessing the database.'
    }, { status: 500 });
  }
}
